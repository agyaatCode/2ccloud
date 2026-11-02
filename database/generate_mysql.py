#!/usr/bin/env python3
"""Generates database/schema.mysql.sql (MySQL 8 / MariaDB, phpMyAdmin-importable) from the live PostgreSQL schema.
Usage: python3 database/generate_mysql.py   (reads DATABASE_URL, defaults to the local dev database)"""
import os, re, subprocess, collections

URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@127.0.0.1:5432/app_db")


def q(sql):
    out = subprocess.run(["psql", URL, "-At", "-F", "\x1f", "-c", sql], capture_output=True, text=True).stdout
    return [l.split("\x1f") for l in out.strip().split("\n") if l]


cols = q("select table_name,column_name,data_type,coalesce(character_maximum_length::text,''),is_nullable,coalesce(column_default,'') from information_schema.columns where table_schema='public' and table_name not like '%drizzle%' order by table_name,ordinal_position")
cons = q("select conrelid::regclass::text,contype,conname,pg_get_constraintdef(oid) from pg_constraint where connamespace='public'::regnamespace order by 1,2,3")
idx = q("select tablename,indexname,indexdef from pg_indexes where schemaname='public'")
tables = collections.OrderedDict()
for t, c, dt, ln, nul, df in cols:
    tables.setdefault(t, []).append((c, dt, ln, nul, df))

BIG = ("content", "long_description", "body", "schema_json", "details", "data")


def mtype(dt, ln, df, c):
    if "nextval" in df or dt == "integer":
        return "INT"
    if dt == "character varying":
        return f"VARCHAR({ln})"
    if dt == "text":
        return "MEDIUMTEXT" if c in BIG else "TEXT"
    if dt == "boolean":
        return "TINYINT(1)"
    if dt.startswith("timestamp"):
        return "DATETIME"
    if dt == "date":
        return "DATE"
    if dt == "jsonb":
        return "JSON"
    return dt.upper()


def mdef(dt, df):
    if not df or "nextval" in df or dt == "jsonb":
        return ""
    if df.startswith("now()"):
        return " DEFAULT CURRENT_TIMESTAMP"
    if df in ("true", "false"):
        return " DEFAULT " + ("1" if df == "true" else "0")
    m = re.match(r"^'(.*)'::", df)
    if m:
        return f" DEFAULT ('{m.group(1)}')" if dt == "text" else f" DEFAULT '{m.group(1)}'"
    if re.match(r"^-?\d+$", df):
        return " DEFAULT " + df
    return ""


def collist(s):
    return ", ".join("`" + c.strip().strip('"') + "`" for c in s.split(","))


out = [
    "-- MySQL / MariaDB schema mirror (phpMyAdmin-compatible), generated from the PostgreSQL schema used by the app.",
    "-- Requires MySQL 8.0.13+ or MariaDB 10.2.1+.  phpMyAdmin → Import → choose this file.",
    "SET NAMES utf8mb4;", "SET FOREIGN_KEY_CHECKS=0;", "",
]
for t, cs in tables.items():
    lines = []
    for c, dt, ln, nul, df in cs:
        ai = " AUTO_INCREMENT" if "nextval" in df else ""
        upd = " ON UPDATE CURRENT_TIMESTAMP" if c == "updated_at" else ""
        lines.append(f"  `{c}` {mtype(dt, ln, df, c)}{' NOT NULL' if nul == 'NO' else ' NULL'}{ai}{mdef(dt, df)}{upd}")
    mine = [x for x in cons if x[0] == t]
    for _, ty, name, d in mine:
        inner = re.search(r"\((.*?)\)", d).group(1)
        if ty == "p":
            lines.append(f"  PRIMARY KEY ({collist(inner)})")
        elif ty == "u":
            lines.append(f"  UNIQUE KEY `{name}` ({collist(inner)})")
    for _, ty, name, d in mine:
        if ty != "f":
            continue
        m = re.match(r"FOREIGN KEY \((.*?)\) REFERENCES (\w+)\((.*?)\)(.*)", d)
        rule = " ON DELETE CASCADE" if "ON DELETE CASCADE" in m.group(4) else " ON DELETE SET NULL" if "ON DELETE SET NULL" in m.group(4) else ""
        upd = " ON UPDATE CASCADE" if "ON UPDATE CASCADE" in m.group(4) else ""
        lines.append(f"  CONSTRAINT `{name}` FOREIGN KEY (`{m.group(1)}`) REFERENCES `{m.group(2)}` (`{m.group(3)}`){rule}{upd}")
    for tn, iname, idef in idx:
        if tn != t or iname.endswith("_pkey") or iname.endswith("_key") or iname in {x[2] for x in mine}:
            continue
        m = re.search(r"CREATE (UNIQUE )?INDEX \w+ ON public\.\w+ USING btree \((.*)\)", idef)
        lines.append(f"  {'UNIQUE ' if m.group(1) else ''}KEY `{iname}` ({collist(m.group(2))})")
    out.append(f"CREATE TABLE IF NOT EXISTS `{t}` (\n" + ",\n".join(lines) + "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n")
out.append("SET FOREIGN_KEY_CHECKS=1;")
open(os.path.join(os.path.dirname(__file__), "schema.mysql.sql"), "w").write("\n".join(out))
print(len(tables), "tables written to database/schema.mysql.sql")
