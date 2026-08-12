# build-theme-css.ps1
# Concatena los parciales del tema Sintera en application.css
# Ejecutar antes de: docker compose exec app rake assets:clobber assets:precompile

param()

$src    = Join-Path $PSScriptRoot "..\redmine\themes\sintera\stylesheets"
$output = Join-Path $src "application.css"

$files = @(
    "import-redmine",
    "tokens",
    "global",
    "components",
    "sidebar",
    "sidebar-responsive",
    "login"
)

$header = "/* === GENERATED - edit the source files, not this file ===
 * Source: redmine/themes/sintera/stylesheets/<name>.css
 * Build:  scripts/build-theme-css.ps1
 * ======================================================= */

"

$body = $files | ForEach-Object {
    $path = Join-Path $src "$_.css"
    Get-Content $path -Raw
}

$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($output, ($header + ($body -join "`n")), $utf8)

$size = (Get-Item $output).Length
Write-Host "application.css rebuilt ($size bytes)"