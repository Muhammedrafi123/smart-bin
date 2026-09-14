# Render a .pptx to PNG slides using the installed PowerPoint, for visual QA.
#   powershell -File deck/render.ps1 -Deck <abs.pptx> -Out <abs dir>
param(
  [Parameter(Mandatory = $true)][string]$Deck,
  [Parameter(Mandatory = $true)][string]$Out
)

$ErrorActionPreference = 'Stop'

if (Test-Path $Out) { Remove-Item "$Out\*.png" -Force -ErrorAction SilentlyContinue }
else { New-Item -ItemType Directory -Path $Out | Out-Null }

$app = New-Object -ComObject PowerPoint.Application
$deckObj = $app.Presentations.Open($Deck, $true, $false, $false)   # readonly, untitled:false, withwindow:false
try {
  $deckObj.SaveAs($Out, 18)   # ppSaveAsPNG = 18
  Write-Output ("slides: " + $deckObj.Slides.Count)
}
finally {
  $deckObj.Close()
  $app.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null
}

Get-ChildItem $Out -Filter *.png | Sort-Object Name | ForEach-Object { $_.FullName }
