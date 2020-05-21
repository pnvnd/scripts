REM Uninstall exisiting WiX Application installation
C:\Temp\Wix_Installer.exe /uninstall /quiet

REM Install WiX Applicatrion Complete package
C:\Temp\Wix_Installer.exe /quiet

REM Delete Desktop Shortcuts
del %public%\Desktop\"Wix_App.lnk"

REM Uninstall Extras
"C:\Program Files (x86)\InstallShield Installation Information\{GUID}\setup.exe" /s /uninst