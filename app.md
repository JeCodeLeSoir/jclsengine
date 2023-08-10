dotnet new photinoapp -o EscargotSpace
dotnet new photinostaticfileserver -o EscargotSpace

npx typedoc --tsconfig jclsengine/tsconfig.esm.json && rm -rf ./jclsengine/dist && npx tsc -b jclsengine/tsconfig.esm.json && cd ./game && npm install --save ../jclsengine && cd ../

npx tsc -b game/tsconfig.esm.json && cd ./game && python buidForGithubPage.py && cd ..


git add -A && git commit -m "update" && git push