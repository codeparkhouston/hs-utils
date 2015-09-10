mkdir dist/$1/
cp -r src/template-lesson/ dist/$1/
rm dist/$1/*/*.jade
rm dist/$1/**.jade
jade src/template-lesson/**.jade -o dist/$1/ -O src/lesson-configs/$1.json -P
jade src/template-lesson/project/**.jade -o dist/$1/project/ -O src/lesson-configs/$1.json -P
jade src/template-lesson/exercise/**.jade -o dist/$1/exercise/ -O src/lesson-configs/$1.json -P
jade src/template-lesson/concepts/**.jade -o dist/$1/concepts/ -O src/lesson-configs/$1.json -P