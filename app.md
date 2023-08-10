dotnet new photinoapp -o EscargotSpace
dotnet new photinostaticfileserver -o EscargotSpace

rm -rf ./jclsengine/dist && npx tsc -b jclsengine/tsconfig.esm.json && cd ./game && npm install --save ../jclsengine && cd ../
npx tsc -b game/tsconfig.esm.json


npx typedoc --tsconfig jclsengine/tsconfig.esm.json


python buidForGithubPage.py