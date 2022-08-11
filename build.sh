#!/bin/bash

rm -rf dist/assets/
rm -rf dist/js/assets/
mkdir -p dist/assets/
mkdir -p dist/css/
cp -rf assets/ dist/assets

cp *.html dist/

mv -v dist/js/*.css dist/css

rm -rf dist/js/integration.js
cp -rf js/components/integration.js dist/js/


sass --style=compressed --no-source-map sass/components/_overlay.scss ./dist/css/overlay.css
sass --style=expanded --no-source-map sass/styles.scss ./dist/css/common.css
sass --style=expanded --no-source-map sass/integration.scss ./dist/css/integration.css

find dist/css -type f -exec sed -E -i '' 's/\.\.\/\.\.\/assets\/|\.\/assets\//\.\.\/assets\//g' {} \;
find dist/js/*.js -type f -exec sed -i '' "s|../../../assets/|./assets/|g" {} \;

TAB=$'\t'
BS=$'\\\n'

rm -rf ./temp

OVERLAY="${TAB}<link id=\"overlayStyles\" rel=\"stylesheet\" href=\"./css/overlay.css\">${BS}</head>";
COMMON="${TAB}<link id=\"commonStyles\" rel=\"stylesheet\" href=\"./css/common.css\">${BS}</head>";
INTEGRATION="${TAB}<link id=\"integrationStyles\" rel=\"stylesheet\" href=\"./css/integration.css\">${BS}</head>";

STYLES_HOME="${TAB}<link id=\"mainStyles\" rel=\"stylesheet\" href=\"./css/home.css\"/>${BS}</head>";

find dist/*.html -type f -exec sed -i '' "s|<\/head>|$OVERLAY|g" {} \;
find dist/*.html -type f -exec sed -i '' "s|<\/head>|$COMMON|g" {} \;

sed -i '' $"s|<\/head>|$STYLES_HOME|g" dist/index.html


find dist/*.html -type f -exec sed -i '' "s|<\/head>|$INTEGRATION|g" {} \;

find dist/index.html -type f -exec sed -i '' "s|/home.js|./js/home.js|g" {} \;
find dist/nosotros.html -type f -exec sed -i '' "s|/about.js|./js/about.js|g" {} \;
find dist/sustentabilidad.html -type f -exec sed -i '' "s|/sustainability.js|./js/sustainability.js|g" {} \;
find dist/contacto.html -type f -exec sed -i '' "s|/contact.js|./js/contact.js|g" {} \;
find dist/solutions-*.html -type f -exec sed -i '' "s|/solutions.js|./js/solutions.js|g" {} \;

find dist/*.html -type f -exec sed -i '' "s|/integration.js|./js/integration.js|g" {} \;