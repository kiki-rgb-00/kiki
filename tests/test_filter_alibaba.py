import importlib.util
from pathlib import Path
import unittest


spec = importlib.util.spec_from_file_location(
    "filter_alibaba", Path(__file__).resolve().parents[1] / "scripts/filter-alibaba.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class AlibabaFilterTests(unittest.TestCase):
    def test_classical_and_domain_formats(self):
        for rule in [
            "+.img.alicdn.com",
            "'DOMAIN-SUFFIX,img.alicdn.com'",
            '"DOMAIN,IMG.ALICDN.COM."',
            "DOMAIN-SUFFIX,alicdn.com",
        ]:
            with self.subTest(rule=rule):
                self.assertEqual(module.filter_rules(f"payload:\n  - {rule}\n"), "payload:\n")

    def test_known_ads_retained_in_both_formats(self):
        for domain in module.KEEP:
            for rule in [f"+.{domain}", f"DOMAIN-SUFFIX,{domain}"]:
                source = f"# attribution\npayload:\n  - {rule}\n"
                self.assertEqual(module.filter_rules(source), source)

    def test_unrelated_rules_and_domain_boundaries(self):
        source = """# attribution
payload:
  - DOMAIN-SUFFIX,example.com
  - DOMAIN-SUFFIX,alicdn.com.example.com
  - DOMAIN-SUFFIX,notalicdn.com
  - '+.sinaalicdn.com'
  - DOMAIN-KEYWORD,example
  - IP-CIDR,192.0.2.1/32
"""
        self.assertEqual(module.filter_rules(source), source)

    def test_idempotent(self):
        source = "payload:\n  - DOMAIN-SUFFIX,img.alicdn.com\n  - +.alimama.alicdn.com\n"
        filtered = module.filter_rules(source)
        self.assertEqual(module.filter_rules(filtered), filtered)


if __name__ == "__main__":
    unittest.main()
