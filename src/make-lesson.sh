WD=$( pwd )
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
mkdir $WD/dist/$1/
cp -r $DIR/template-lesson/ $WD/dist/$1/
rm $WD/dist/$1/*/*.jade
rm $WD/dist/$1/**.jade
jade $DIR/template-lesson/**.jade -o $WD/dist/$1/ -O $DIR/lesson-configs/$1.json -P
jade $DIR/template-lesson/project/**.jade -o $WD/dist/$1/project/ -O $DIR/lesson-configs/$1.json -P
jade $DIR/template-lesson/exercise/**.jade -o $WD/dist/$1/exercise/ -O $DIR/lesson-configs/$1.json -P
jade $DIR/template-lesson/concepts/**.jade -o $WD/dist/$1/concepts/ -O $DIR/lesson-configs/$1.json -P