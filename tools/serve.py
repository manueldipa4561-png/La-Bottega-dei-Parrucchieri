# Run from anywhere: python3 tools/serve.py [port] -- serves the site on localhost with the netlify.toml headers (incl. CSP)
import os, re, sys, fnmatch
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
def rules():  # re-read on every request, so a regenerated CSP hash applies without a restart
    toml = open(os.path.join(root, 'netlify.toml'), encoding='utf-8').read()
    return [(m.group(1), dict(re.findall(r'^\s*([\w-]+)\s*=\s*"(.*)"\s*$', m.group(2), re.M)))
            for m in re.finditer(r'\[\[headers\]\]\s*for\s*=\s*"([^"]+)"\s*\[headers\.values\](.*?)(?=\[\[|\Z)', toml, re.S)]
class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=root, **k)
    def end_headers(self):
        for pat, vals in rules():
            if fnmatch.fnmatch(self.path.split('?')[0], pat):
                for k, v in vals.items():
                    if k != 'Strict-Transport-Security': self.send_header(k, v.replace('; upgrade-insecure-requests', ''))
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
print(f'http://localhost:{port}', flush=True)
ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
