Set objShell = WScript.CreateObject("WScript.Shell")
intReturn = objShell.Run("jison interprete.jison", 1, true)
If intReturn <> 0 Then 
   Wscript.Echo "Error running program"
End If

Const ForReading = 1
Const ForWriting = 2
Const FileIn = "interprete.js"
Const FileOut = "interprete.js"

Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile(FileIn, ForReading)

strText = objFile.ReadAll
objFile.Close

strNewText = Replace(strText,"var interprete","import Logical from './clases/Logical';" & vbCrLf &"import Relational from './clases/Relational';" & vbCrLf &"import Arithmetical from './clases/Arithmetical';" & vbCrLf &"import Value from './clases/Value';" & vbCrLf &"import Print from './clases/Print';" & vbCrLf &"import Declaration from './clases/Declaration';" & vbCrLf &"import Function from './clases/Function';" & vbCrLf &"import Return from './clases/Return';" & vbCrLf &"import Call from './clases/Call';" & vbCrLf &"import IfList from './clases/IfList';" & vbCrLf &"import Else from './clases/Else';" & vbCrLf &"import If from './clases/If';" & vbCrLf &"import While from './clases/While';" & vbCrLf &"import DoWhile from './clases/DoWhile';" & vbCrLf &"import Assignment from './clases/Assignment';" & vbCrLf &"import Switch from './clases/Switch';" & vbCrLf &"import For from './clases/For';" & vbCrLf &"import Unary from './clases/Unary'; " & vbCrLf &"import Break from './clases/Break';" & vbCrLf &"import Continue from './clases/Continue';" & vbCrLf &"import Type from './clases/Type';" & vbCrLf &"import SymbolTable from './clases/SymbolTable';" & vbCrLf &"import TernaryOperator from './clases/TernaryOperator';" & vbCrLf &"import { add_error_E } from './clases/Reports';" & vbCrLf &"import UnaryNoReturn from './clases/UnaryNoReturn';" & vbCrLf &"import { simbtable_E } from './clases/Reports';" & vbCrLf & "export var interprete" )

Set objFile = objFSO.OpenTextFile(FileOut, ForWriting)
objFile.WriteLine strNewText
objFile.Close