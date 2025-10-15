local commit
{
	git checkout -b local
	git add . 
	git commit -m "commit message"
	git push origin local
}

publish commit
{
	git checkout main
	git merge local
	git push origin main
}