#!/usr/bin/env python3
"""Apply the same Alibaba CDN exclusions to classical YAML and domain YAML."""

import argparse
from pathlib import Path


KEEP = {
    "alimama.alicdn.com",
    "aecpm.alicdn.com",
    "afp.alicdn.com",
    "afpmm.alicdn.com",
    "atanx2.alicdn.com",
    "unidesk.alicdn.com",
}


def filter_rules(text):
    output = []
    for line in text.splitlines():
        entry = line.strip()
        if not entry.startswith("-"):
            output.append(line)
            continue
        rule = entry[1:].strip().strip("'\"")
        parts = [part.strip() for part in rule.split(",")]
        if len(parts) > 1:
            if parts[0].upper() not in {"DOMAIN", "DOMAIN-SUFFIX"}:
                output.append(line)
                continue
            domain = parts[1]
        else:
            domain = rule
        domain = domain.lower().rstrip(".")
        if domain.startswith("+."):
            domain = domain[2:]
        if (domain == "alicdn.com" or domain.endswith(".alicdn.com")) and domain not in KEEP:
            continue
        output.append(line)
    return "\n".join(output) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", type=Path, nargs="+")
    for path in parser.parse_args().paths:
        original = path.read_text(encoding="utf-8")
        filtered = filter_rules(original)
        path.write_text(filtered, encoding="utf-8")
        print(f"{path}: removed {len(original.splitlines()) - len(filtered.splitlines())} rules")


if __name__ == "__main__":
    main()
