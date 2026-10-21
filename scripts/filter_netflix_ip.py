import argparse
import ipaddress
from pathlib import Path

import yaml


SUPPORTED_IP_TYPES = {
    "IP-CIDR",
    "IP-CIDR6",
}


def convert_ip_rules(input_path: Path, output_path: Path):
    """
    Filter Netflix IP rules and emit a Mihomo IP-CIDR ruleset YAML
    payload containing CIDR values only.

    Supports both raw CIDRs (the format used by the current upstream
    Netflix_IP.yaml) and classical Clash rules such as:
      1.2.3.0/24
      2001:db8::/32
      IP-CIDR,1.2.3.0/24,no-resolve
      IP-CIDR6,2001:db8::/32,no-resolve

    DOMAIN, DOMAIN-SUFFIX, GEOIP, PROCESS-NAME and malformed/empty
    rules are excluded.
    """

    data = yaml.safe_load(input_path.read_text(encoding="utf-8"))

    if not isinstance(data, dict) or not isinstance(data.get("payload"), list):
        raise ValueError(f"{input_path} does not contain a valid YAML payload list")

    output_rules = []
    skipped = 0

    for raw_rule in data["payload"]:
        if not isinstance(raw_rule, str):
            skipped += 1
            continue

        line = raw_rule.strip().strip("'\"")
        if not line:
            skipped += 1
            continue

        # Current upstream Netflix_IP.yaml uses raw CIDR strings.
        # Also accept classical Clash entries for compatibility.
        parts = [part.strip() for part in line.split(",")]
        rule_type = None
        if len(parts) >= 2 and parts[0].upper() in SUPPORTED_IP_TYPES:
            rule_type = parts[0].upper()
            cidr = parts[1].strip().strip("'\"")
        elif len(parts) == 1:
            cidr = parts[0].strip().strip("'\"")
        else:
            skipped += 1
            continue

        if not cidr:
            skipped += 1
            continue

        try:
            network = ipaddress.ip_network(cidr, strict=False)
        except ValueError:
            skipped += 1
            continue

        if rule_type == "IP-CIDR" and network.version != 4:
            skipped += 1
            continue
        if rule_type == "IP-CIDR6" and network.version != 6:
            skipped += 1
            continue

        output_rules.append(str(network))

    output_rules = sorted(set(output_rules))

    if not output_rules:
        raise ValueError(
            f"No valid IP-CIDR/IP-CIDR6 networks found in {input_path}"
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        yaml.safe_dump(
            {"payload": output_rules},
            allow_unicode=True,
            sort_keys=False,
        ),
        encoding="utf-8",
    )

    print(f"Netflix IP rules kept: {len(output_rules)}")
    print(f"Invalid/non-IP rules skipped: {skipped}")
    return output_rules


def main():
    parser = argparse.ArgumentParser(
        description="Prepare Netflix IP CIDR rules for Mihomo MRS."
    )
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    convert_ip_rules(args.input, args.output)


if __name__ == "__main__":
    main()
