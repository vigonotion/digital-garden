---
tags:
  - windows
  - port
  - powershell
  - network
date: 2024-04-11
---

To see which application uses a port, run this in powershell:

```bash
Get-Process -Id (Get-NetTCPConnection -LocalPort 2019).OwningProcess
```

Which will output:

```bash
 NPM(K)    PM(M)      WS(M)     CPU(s)      Id  SI ProcessName
 ------    -----      -----     ------      --  -- -----------
    157    52,61     101,78      82,66   19452   1 Code
```