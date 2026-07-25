# Install Actiwitee scheduled tasks on Windows (Task Scheduler).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/install-tasks.ps1
# Remove: powershell -ExecutionPolicy Bypass -File scripts/install-tasks.ps1 -Uninstall

param([switch]$Uninstall)

$CliDir = Split-Path -Parent $PSScriptRoot
$Agent = Join-Path $PSScriptRoot "actiwitee-agent.cmd"
$Publish = Join-Path $PSScriptRoot "actiwitee-publish.cmd"
$AgentTask = "Actiwitee Agent"
$PublishTask = "Actiwitee Publish"

if (-not (Test-Path (Join-Path $CliDir "dist\cli.js"))) {
  Write-Error "Run npm run build from the repo root first."
  exit 1
}

if ($Uninstall) {
  schtasks /Delete /TN $AgentTask /F 2>$null
  schtasks /Delete /TN $PublishTask /F 2>$null
  Write-Host "Removed Windows scheduled tasks."
  exit 0
}

$AgentAction = "cmd /c `"$Agent`""
$PublishAction = "cmd /c `"$Publish`""

schtasks /Create /F /TN $AgentTask /TR $AgentAction /SC MINUTE /MO 5 /RL LIMITED | Out-Null
schtasks /Create /F /TN $PublishTask /TR $PublishAction /SC HOURLY /RL LIMITED | Out-Null

Write-Host "Installed scheduled tasks:"
Write-Host "  $AgentTask  every 5 minutes"
Write-Host "  $PublishTask every hour"
Write-Host ""
Write-Host "Optional env (set in System Properties > Environment Variables):"
Write-Host "  ACTIWITEE_R2_BUCKET=your-bucket"
Write-Host "  ACTIWITEE_R2_KEY=actiwitee/activity.json"
Write-Host ""
Write-Host "Verify: taskschd.msc  or  schtasks /Query /TN `"$AgentTask`""
Write-Host "Remove: powershell -ExecutionPolicy Bypass -File scripts/install-tasks.ps1 -Uninstall"
