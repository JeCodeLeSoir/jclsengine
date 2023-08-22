# compile web assembly
asc apptest.ts -o out.wasm


emcc apptest.cpp -s STANDALONE_WASM –o reverse.wasm