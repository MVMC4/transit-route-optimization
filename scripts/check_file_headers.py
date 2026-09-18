"""Report first-party source files missing the repository purpose-comment convention."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOTS = ("api/app", "rider/app", "rider/components", "rider/lib", "marketing/app", "marketing/components", "docs-site/app", "docs-site/components", "docs-site/lib")
SUFFIXES = {".py", ".ts", ".tsx"}


def documented(path: Path) -> bool:
    text = path.read_text(encoding="utf-8").lstrip()
    if path.suffix == ".py":
        return text.startswith(('"""', "'''"))
    if text.startswith(('"use client"', "'use client'")):
        text = text.split(";", 1)[-1].lstrip()
    return text.startswith(("/**", "//"))


missing = [path.relative_to(ROOT) for source_root in SOURCE_ROOTS for path in (ROOT / source_root).rglob("*") if path.suffix in SUFFIXES and not documented(path)]
if missing:
    print("Source files missing a purpose header:")
    for path in missing:
        print(f"- {path}")
    raise SystemExit(1)
print("All checked first-party source files have purpose headers.")
