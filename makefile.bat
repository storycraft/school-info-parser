@echo off
webpack && java -jar G:\compiler-latest\closure-compiler-v20170806.jar --compilation_level SIMPLE_OPTIMIZATIONS --js dist\school-info-parser.js --js_output_file dist\story-framework.min.js && pause
pause