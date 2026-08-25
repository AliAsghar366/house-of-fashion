foreach ($p in @('/', '/admin', '/shop', '/checkout', '/promos', '/contact')) {
  try {
    $r = Invoke-WebRequest -Uri ("http://localhost:2136" + $p) -UseBasicParsing -TimeoutSec 15
    Write-Host ($p + " -> " + $r.StatusCode + " (" + $r.Content.Length + " bytes)")
  } catch {
    Write-Host ($p + " -> ERROR")
  }
}
