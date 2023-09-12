

## 云端存储目录
/modellink/models/{namespace}/{model_name}/ckpt.bin
/modellink/models/{namespace}/{model_name}/configuration.json
/modellink/datasets/{namespace}/{dataset_name}.tar
OBS中使用到的固定桶为`modellink`, 模型文件（权重、模型配置等）和数据集文件分属两个不同目录`models`、`datasets`。各个目录下，由命名空间`namespace`进行隔离，默认`namespace`为`modellink`。

## 常量定义
服务地址：obs.cn-central-221.ovaijisuan.com

## 场景
- checkpoint、configuration等模型文件下载
- dataset数据集下载

## 规格
- 对接OBS的接口网络异常，重试策略为
> - 重试最大次数: 5
> - 重试基础时间间隔：2s
> - 重试间隔递增factor：2

- 下载后缓存文件、文件夹权限受控

## 数据结构
- Hub从远端获取的文件数据结构
```python
@dataclass
class FileMetaInfo:
	file_name: str
	namespace: str
	relative_full_path: str
	size: int
	last_modified: str
	version_id: str
```


## Hub API
**公开接口**
- Hub.download_model_file
> 单个模型文件下载接口
> - 对接OBSClient，直接对桶中规划模型路径中的文件进行下载。
```python
def download_model_file(model_name: str, file_path: str, namespace: Optional[str], cache_dir: Optional[str], local_files_only: Optional[bool]=False) -> Optional[str]:
	"""Download from a given URL and cache it if it's not already present in the local cache.
	Given a URL, this functions looks for the corresponding file in the local cache. If it's not true, download it. Then return the path to the cached file.
	
	Args:
		model_name (str): The model to whom the file to be downloaded belongs.
		file_path (str): Path of the file to be downloaded, relative to the root of model namespace repo.
		namespace (str, optional): Namespace (sub-folder) of models directory, default is `modellink`.
		cache_dir (str, Path, optional): Path to the folder where cached filed are stored.
		local_files_only (bool, optional): if `True`, avoid downloading the file and return the path to the local cached file if it exists. if `False`, download the file anyway even it existed
	
	Returns:
		string: string of local file path.
	
	"""
	pass
```

- Hub.download_model_snapshot
> 模型目录下载接口
> - 对接OBSClient，通过遍历桶中特定模型路径进行列举，并递归下载各个子文件夹中的文件。


```python
def download_model_snapshot(model_name: str, namespace: Optional[str], cache_dir: Optional[str], local_files_only: Optional[bool]=False, ignore_file_patterns: Optional[List[str]]) -> str:
	"""Download all files of a model repo
	Downloads a whole snapshot of a model repo's files. This is useful when you want all files from a repo, as you don't know which ones you will need a priori. All files are nested inside a folder in order to keep their actual filename relative to that folder.
	
	Args:
		model_name (str): The model to whom the file to be downloaded belongs.
		namespace (str, optional): Namespace (sub-folder) of models directory, default is `modellink`.
		cache_dir (str, Path, optional): Path to the folder where cached filed are stored.
		local_files_only (bool, optional): if `True`, avoid downloading the files and return the path to the local cached folder if it exists. if `False`, download the folder anyway even it existed.
		ignore_file_patterns (List[str], optional): Any file pattern to be ignored in downloading, like *file_name* or *extension*
		
	Returns:
		 Local folder path (string) of repo snapshot
	"""
	pass
```


- Hub.download_dataset_file
> dataset文件下载接口, 并将文件下载到特定的路径
>  - 若目标文件路径未指定，则默认使用`cache`路径为根路径，并以{namespace}/{dataset_name}/{file_name}为相对路径

```python
def download_dataset_file(dataset_file_name: str, namespace: Optional[str], target_path: Optional[str]) -> str:
	"""Download certain dataset file from dataset folder
	
	Args:
		dataset_file_name (str): The dataset file name to be downloaded
		namespace (str, optional): Namespace (sub-folder) of datasets directory, default is `modellink`.
		target_path: (str, optional): Target path of downloaded file.
		
	Returns:
		string: string of local file path.
	"""
	pass
```

- Hub.download_dataset_snapshot
> dataset目录下载接口，并将文件夹下载到特定的路径
> - 若目标文件路径未指定，则默认使用`cache`路径为根路径，并以{namespace}/{dataset_name}为相对路径

```python
def download_dataset_snapshot(namespace: Optional[str], target_path: Optional[str], ignore_file_patterns: Optional[List[str]]) -> str:
	"""
	Args:
		namespace (str, optional): Namespace (sub-folder) of datasets directory, default is `modellink`.
		target_path: (str, optional): Target path of downloaded folder.
		ignore_file_patterns (List[str], optional): Any file pattern to be ignored in downloading, like *file_name* or *extension*
		
	Returns:
		string: string of local folder path.
	"""
	pass
```

**非公开接口**
- get_model_files
> 获取模型目录下的所有文件

```python
def get_model_files(model_name: str, namespace: Optional[str], prefix: Optional[str]) -> List[FileMetaInfo]:
	"""List the model files
	
	Args:
		model_name (str): The model to whom the file to be downloaded belongs.
		namespace (str, optional): Namespace (sub-folder) of models directory, default is `modellink`.
		prefix (str, optional): Return files constrained to certain prefix.
	
	Returns:
		List[FileMetaInfo]: Model file list
	"""
	pass
```

- parallel_download_file
> 针对大文件（> 500mb），进行并发断点续传下载，解决大对象到本地时，因为网络不稳定或者程序奔溃导致下载失败的问题。将待下载的大文件分成若干个片段进行下载。
> - 下载并发数，默认值为1
> - 分块下载
> 
```python
def parallel_download_file(bucket_file_path: str, local_dir: str, file_size: int = None):
	pass
```

## 本地文件缓存
以环境变量`MODELLINK_CACHE`指定缓存根路径，默认为`~/.cache/modellink/hub`。

**缓存文件Layouts**
`{cache_root}/datasets/{namespace}/{dataset_name}/individual`
`{cache_root}/models/{namespace}/{model_name}/individual`


**缓存索引**
`{cache_root}/.msc`

**Cache接口**

```python
class FilesCache(FileSystemCache):
	def __init__(cache_root: str):
		pass
	
	def get_file_by_path(self, file_path: str) -> str:
		pass
	
	def get_file_by_info(self, file_info: FileMetaInfo) -> str:
		pass
	
	def file_exist(self, file_info: FileMetaInfo) -> bool:
		pass
	
	def remove_if_exists(self, file_info: FileMetaInfo) -> None:
		pass
	
	def put_file(self, file_info: FileMetaInfo, file_location: str) -> None:
		pass
		
```



## Hub基本能力流程
**文件下载流程**
- 判断`cache_dir`是否为空，空则使用默认缓存路径
- 设置临时目录`{cache_dir}/tmp`并创建
- 若设置了`local_files_only`：
 > - 判断缓存目录下是否已经有了`file_name`，若有则返回缓存目录下的文件绝对路径
 > - 否则抛出异常
- 调用`OBSClient`获取特定`namespace`下的模型文件对象元数据信息
- 判断对象数据大小是否超过一定阈值（e.g: 500MB）：
> 若是，则使用分块并行下载
> 反之则正常下载对象
- 下载文件到临时目录中
- 校验对象文件md5
- 将对象放入缓存中
- 对象文件权限修改

**文件夹下载流程**
- 判断`cache_dir`是否为空，空则使用默认缓存路径
- 设置临时目录`{cache_dir}/tmp`并创建
-  若设置了`local_files_only`：
 > - 判断缓存目录下目标文件目录是否为空，若是则抛出异常
 > - 否则直接返回目标文件目录路径
- 调用`OBSClient`获取特定`namespace`和`model_name`目录下所有对象的元数据信息
- 根据`ignore_file_patterns`进行对象过滤
- 遍历所有文件对象，若`cache`中已经存在该文件，则跳过下载，否则下载。
- 判断对象数据大小是否超过一定阈值（e.g: 500MB）：
> 若是，则使用分块并行下载
> 反之则正常下载对象
- 校验对象文件md5
- 将文件对象放入缓存中
- 对象文件权限修改


## 测试用例设计

1. model文件下载成功
2. model文件下载异常（远端文件不存在）
3. model文件夹下载成功
4. model文件夹下载异常（远端文件夹不存在）
5. API重试策略测试
6. 数据集下载成功
7. 数据集下载异常（远端文件不存在）
8. 数据集文件夹下载成功
9. 数据集文件夹下载异常（远端文件夹不存在）
10. 数据集加载集成接口测试（MLDataset.load）
11. 缓存索引文件生命周期测试
12. 缓存文件索引基本测试 （添加、删除、存在性判断）
13. 缓存文件移动测试
