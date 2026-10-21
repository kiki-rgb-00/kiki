import argparse
import re
from pathlib import Path


SUPPORTED_DOMAIN_TYPES = {
    "DOMAIN",
    "DOMAIN-SUFFIX",
}


def normalize_domain(domain: str) -> str:
    domain = domain.strip().strip("'\"").lower()

    if domain.startswith("+."):
        domain = domain[2:]
    elif domain.startswith("."):
        domain = domain[1:]

    return domain.rstrip(".")


def convert_domain_rules(input_path: Path, output_path: Path):
    """
    Convert Clash classical domain rules into Mihomo domain text.

    DOMAIN        -> example.com
    DOMAIN-SUFFIX -> +.example.com

    DOMAIN-KEYWORD / PROCESS-NAME / IP rules are excluded.
    """

    output_rules = []

    for raw_line in input_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()

        match = re.match(
            r"^-\s*([A-Z0-9-]+)\s*,\s*(.+?)\s*$",
            line,
            re.IGNORECASE,
        )

        if not match:
            continue

        rule_type = match.group(1).upper()
        value = normalize_domain(match.group(2))

        if rule_type not in SUPPORTED_DOMAIN_TYPES or not value:
            continue

        if rule_type == "DOMAIN":
            output_rules.append(value)
        elif rule_type == "DOMAIN-SUFFIX":
            output_rules.append(f"+.{value}")

    output_rules = sorted(set(output_rules))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(output_rules) + "\n", encoding="utf-8")
    return output_rules


def main():
    parser = argparse.ArgumentParser(
        description="Prepare OpenAI domain rules for Mihomo MRS."
    )
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    rules = convert_domain_rules(args.input, args.output)
    print(f"OpenAI MRS domain rules: {len(rules)}")


if __name__ == "__main__":
    main()
