$svgPath = "compararsegurodeviagem.com.br_seguro_viagem_para_intercambio\assets\world-map-silhouette.svg"
$htmlPath = "index_5.html"

$svgContent = Get-Content -Raw -Path $svgPath
$htmlContent = Get-Content -Raw -Path $htmlPath

# Escape any $ in svgContent just in case
$svgContent = $svgContent.Replace('$', '$$')

# Replace
$htmlContent = $htmlContent -replace '<!-- SVG_INJECTION_POINT -->', $svgContent

Set-Content -Path $htmlPath -Value $htmlContent
Write-Output "Injection complete"
