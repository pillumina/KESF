## Lazy Import Python Design

限制：项目中需要的包导入，需要改成relative而不是absolute

原理：通过将module names映射到public object names，让submodule或者object只有在被引用到的时候才会被import。

`LazyImportObject`

`__getattr__`

`obj.attr` 访问module对象

>- 判断是否name为self._object的key，若是，则返回module
>- 判断是否name为self._modules中的key，若是，调用get_module取出value，并setattr(self, name, value)后，返回value。
>- 如果name均不在上述的结构中，如果在self._class_to_modules的key中，则获取到module，而后getattr(module, name)获取到value，setattr......
>- 以上都不是，则抛出异常



`get_module`导入并获取module

```python
return importlib.import_module("." + module_name, self.__name__)
```





