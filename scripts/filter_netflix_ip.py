import argparse
import re
from pathlib import Path

import yaml


SUPPORTED_IP_TYPES = {
    "IP-CIDR",
    "IP-CIDR6",
}


def convert_ip_rules(input_path: Path, output_path: Path):
    """
    Filter Netflix_IP.yaml and retain IP-CIDR / IP-CIDR6 rules.

    The output is a Clash classical-rule YAML file with a payload list,
    ready for Mihomo conversion, e.g.:
      mihomo convert-ruleset ipcidr yaml input.yaml output.mrs

    Non-IP rules (including DOMAIN, DOMAIN-SUFFIX, GEOIP, PROCESS-NAME)
    are excluded. IP rule options such as no-resolve are preserved.
    """

    data = yaml.safe_load(input_path.read_text(encoding="utf-8"))

    if not isinstance(data, dict) or not isinstance(data.get("payload"), list):
        raise ValueError(f"{input_path} does not contain a valid YAML payload list")

    output_rules = []
    for raw_rule in data["payload"]:
        if not isinstance(raw_rule, str):
            continue

        line = raw_rule.strip()
        # Accept payload values both with and without a leading YAML list marker.
        line = re.sub(r"^-\s*", "", line)

        parts = [part.strip() for part in line.split(",")]
        if not parts:
            continue

        rule_type = parts[0].upper()
        if rule_type not in SUPPORTED_IP_TYPES:
            continue

        if len(parts) < 2 or not parts[1]:
            continue

        # Preserve the original rule text/options, normalizing the rule type.
        output_rules.append(",".join([rule_type, *parts[1:]]))

    output_rules = sorted(set(output_rules))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        yaml.safe_dump({"payload": output_rules}, allow_unicode=True, sort_keys=False),
        encoding="utf-8",
    )

    return output_rules


def main():
    parser = argparse.ArgumentParser(
        description="Prepare Netflix IP rules for Mihomo IP-CIDR MRS."
    )
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    rules = convert_ip_rules(args.input, args.output)
    print(f"Netflix MRS IP rules: {len(rules)}")


if __name__ == "__main__":
    main()
