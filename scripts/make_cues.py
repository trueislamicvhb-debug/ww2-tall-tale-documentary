import json, sys
from pathlib import Path

P = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
timing = json.loads((P / "data/lines.json").read_text())
lines = timing["lines"]
cues = [
    {"t": round(float(line["start"]), 3), "type": "whoosh", "gain": 0.55}
    for i, line in enumerate(lines) if i % 7 == 0
]
(P / "data/cues.json").write_text(json.dumps({"duration": timing["duration"], "cues": cues}, indent=1))
print(f"data/cues.json: {len(cues)} chapter transitions, {timing['duration']:.2f} seconds")
