# 前提

まず、以下のようにファイル／ディレクトリがあるとします。

```sh
$ find dir1 -type f
dir1/file1.txt
dir1/file2.txt
dir1/file3.txt
dir1/dir2/file4.txt
dir1/dir2/file5.txt
dir1/dir2/file6.txt
```

# 準備

圧縮したいファイルが書かれたリストを準備します。

```sh
$ cat list
dir1/file2.txt
dir1/dir2/file5.txt
```

# zipコマンド

zip圧縮します。

```sh
$ cat list | zip test.zip -@
  adding: dir1/file2.txt (stored 0%)
  adding: dir1/dir2/file5.txt (stored 0%)
```
<span style="color: red;">**リストに書かれたファイルだけ圧縮されました。**</span>

<br />

> -@　は、
> ファイル名を標準入力から読む
> という意味です。

<br />

# 他の方法
`$ zip -r test.zip . -i@list`  
としますと、  
list  
に載っているファイルだけ選んでzipして  
同じ結果になりますが、  
一旦配下全てのファイル／ディレクトリを走査しながら  
listに載っているかを調べていますので、  
場合によっては、めちゃくちゃ時間がかかります。

> -r　：　ファイル／ディレクトリ全てを対象とする。
> 
> .（ドット）　：　今いるところから下の階層全て
> 
> -i　：　圧縮対象ファイル／ディレクトリを指定
> 
> -i@[リストファイル]　：　[リストファイル]に載っているファイル／ディレクトリが圧縮対象

<br />

# 注意
当然ですが、zipをインストールしていないと怒られます。

```sh
$ cat list | zip test.zip -@
bash: zip: コマンドが見つかりません
```
<br />

# 確認環境
FreeBSD  
CentOS  
ubuntu  

