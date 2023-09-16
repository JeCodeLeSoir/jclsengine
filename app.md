dotnet new photinoapp -o EscargotSpace
dotnet new photinostaticfileserver -o EscargotSpace

== Build Cmd ==

npx typedoc --tsconfig jclsengine/tsconfig.esm.json && rm -rf ./jclsengine/dist && npx tsc -b jclsengine/tsconfig.esm.json && cd ./game && npm install --save ../jclsengine && cd ../ && npx tsc -b game/tsconfig.esm.json && cd ./game && python buidForGithubPage.py && cd ..

== Build game ==
npx tsc -b game/tsconfig.esm.json && cd ./game && python buidForGithubPage.py && cd ..

== Git ==

git add -A && git commit -m "-- Update -- ❤️" && git push


== itch.io ==
butler push ./GithubPage jecodelesoir/pioupiou:0.0.2