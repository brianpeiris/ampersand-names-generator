git branch -D gh-pages
git checkout -b gh-pages
git add .
git commit -m "publish $(date -Iseconds)"
git push origin gh-pages -f
git checkout main
