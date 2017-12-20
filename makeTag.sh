# 提交指定的tag： ./makeTag.sh tag名称 tag描述
# 测试完成后，生成稳定的升级包版本

if [ -z $1 ]; then
  echo "请输入tag名称"
  exit 1
fi
if [ -z $2 ]; then
  echo "请输入tag描述"
  exit 1
fi
# 获取外部指定的 tag名称 tag描述
TAG_NAME=$1
TAG_DESC=$2
echo "tag名称:"$TAG_NAME "tag描述:"$TAG_DESC
# 参数
JSON_FILE="./list.json"
JSON_BAK_FILE="./list.bak" 
SED=gsed

# 备份 list.json 文件
cp $JSON_FILE $JSON_BAK_FILE
# 修改 list.json 文件中下载地址
$SED "s/master/$TAG_NAME/" -i $JSON_FILE
# 提交代码
git commit -a -m $TAG_DESC

# 增加 tag
git tag -a $TAG_NAME -m $TAG_DESC
# 提交 tag
git push origin --tags
# 恢复 master 分支的 list.json 文件
mv $JSON_BAK_FILE $JSON_FILE

# 恢复 master
git commit -a -m "恢复到master"
git push
