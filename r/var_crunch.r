data$V1G1 <-  -1
data$V1G1[data$AGE>14 & data$AGE<20] <- 1
data$V1G1[data$AGE>19 & data$AGE<25] <- 2
data$V1G1[data$AGE>24 & data$AGE<30] <- 3
data$V1G1[data$AGE>29 & data$AGE<35] <- 4
data$V1G1[data$AGE>35 & data$AGE<40] <- 5
data$V1G1[data$AGE>39 & data$AGE<45] <- 6
data$V1G1[data$AGE>44 & data$AGE<50] <- 7
data$V1G1[data$AGE>49 & data$AGE<55] <- 8
data$V1G1[data$AGE>54 & data$AGE<60] <- 9
data$V1G1[data$AGE>59 & data$AGE<65] <- 10
data$V1G1[data$AGE>64 & data$AGE<70] <- 11
data$V1G1[data$AGE>69] <- 12

data$V1G2 <-  -1
data$V1G2[data$AGE>14 & data$AGE<25] <- 1
data$V1G2[data$AGE>24 & data$AGE<55] <- 2
data$V1G2[data$AGE>54] <- 3

data$V1G3 <- -1
data$V1G3[data$AGE <25] <- 1
data$V1G3[data$AGE >24 & data$AGE<45] <- 2
data$V1G3[data$AGE >44 & data$AGE<65] <- 3
data$V1G3[data$AGE >64] <- 3

data$V2G1 <- -1

data$V2G2 <- -1

data$V2G3 <- -1

data$V3G1 <- -1

data$V3G2 <- -1

data$V4G1 <- -1
data$V4G1[data$NATIONAL==00] <- 1
data$V4G1[data$NATIONAL==01] <- 1
data$V4G1[data$NATIONAL==14] <- 2

data$V5G1 <- -1

data$V6G1<- -1

data$V7G1 <-  -1
data$V7G1[data$HATLEVEL==00] <- 1
data$V7G1[data$HATLEVEL==10] <- 1
data$V7G1[data$HATLEVEL==11] <- 1
data$V7G1[data$HATLEVEL==21] <- 2
data$V7G1[data$HATLEVEL==22] <- 3
data$V7G1[data$HATLEVEL==30] <- 3
data$V7G1[data$HATLEVEL==31] <- 3
data$V7G1[data$HATLEVEL==32] <- 3
data$V7G1[data$HATLEVEL==33] <- 3
data$V7G1[data$HATLEVEL==34] <- -1
data$V7G1[data$HATLEVEL==35] <- -1
data$V7G1[data$HATLEVEL==36] <- -1
data$V7G1[data$HATLEVEL==41] <- 4
data$V7G1[data$HATLEVEL==42] <- 4
data$V7G1[data$HATLEVEL==43] <- 5
data$V7G1[data$HATLEVEL==51] <- 5
data$V7G1[data$HATLEVEL==52] <- 5
data$V7G1[data$HATLEVEL==60] <- 5

data$V7G2<- -1
data$V7G2[data$HATLEVEL==00] <- 1
data$V7G2[data$HATLEVEL==10] <- 1
data$V7G2[data$HATLEVEL==11] <- 1
data$V7G2[data$HATLEVEL==21] <- 1
data$V7G2[data$HATLEVEL==22] <- 2
data$V7G2[data$HATLEVEL==30] <- 2
data$V7G2[data$HATLEVEL==31] <- 2
data$V7G2[data$HATLEVEL==32] <- 2
data$V7G2[data$HATLEVEL==33] <- 2
data$V7G2[data$HATLEVEL==34] <- 2
data$V7G2[data$HATLEVEL==35] <- 2
data$V7G2[data$HATLEVEL==36] <- 2
data$V7G2[data$HATLEVEL==41] <- 2
data$V7G2[data$HATLEVEL==42] <- 2
data$V7G2[data$HATLEVEL==43] <- 2
data$V7G2[data$HATLEVEL==51] <- 2
data$V7G2[data$HATLEVEL==52] <- 2
data$V7G2[data$HATLEVEL==60] <- 2

data$V7G3 <-  -1
data$V7G3[data$HATLEVEL==00] <- 3
data$V7G3[data$HATLEVEL==10] <- 3
data$V7G3[data$HATLEVEL==11] <- 3
data$V7G3[data$HATLEVEL==21] <- 3
data$V7G3[data$HATLEVEL==22] <- 2
data$V7G3[data$HATLEVEL==30] <- 2
data$V7G3[data$HATLEVEL==31] <- 2
data$V7G3[data$HATLEVEL==32] <- 2
data$V7G3[data$HATLEVEL==33] <- 2
data$V7G3[data$HATLEVEL==34] <- 2
data$V7G3[data$HATLEVEL==35] <- 2
data$V7G3[data$HATLEVEL==36] <- -2
data$V7G3[data$HATLEVEL==41] <- 2
data$V7G3[data$HATLEVEL==42] <- 2
data$V7G3[data$HATLEVEL==43] <- 2
data$V7G3[data$HATLEVEL==51] <- 1
data$V7G3[data$HATLEVEL==52] <- 1
data$V7G3[data$HATLEVEL==60] <- 1


data$V8G1 <- -1

data$V9G1 <- -1
data$V9G1[data$SIZEFIRM<12] <- 1
data$V9G1[data$SIZEFIRM==12] <- 2
data$V9G1[data$SIZEFIRM==13] <- 2
data$V9G1[data$SIZEFIRM==14] <- 1
data$V9G1[data$SIZEFIRM==99] <- 2

data$V9G2 <- -1
data$V9G2[data$SIZEFIRM<12] <- 1
data$V9G2[data$SIZEFIRM==12|data$SIZEFIRM==13] <- 2

data$V9G3 <- -1

data$V10G1 <- -1
data$V10G1[data$FTPT==1] <- 1
data$V10G1[data$FTPT==2] <- 2
data$V10G1[data$FTPT==9]<- -1


data$V10G2 <- -1
data$V10G2[data$HWUSUAL>34] <- 1
data$V10G2[data$HWUSUAL<35]<- 2
data$V10G2[data$HWUSUAL==00] <- -2

data$V10G3 <- -1
data$V10G3[data$HWUSUAL<15] <- 1
data$V10G3[data$HWUSUAL>15 & data$HWUSUAL<35]<- 2
data$V10G3[data$HWUSUAL==00] <- -2
data$V10G3[data$HWUSUAL>35] <- 3

data$V11G1 <- -1
data$V11G1[data$TEMP==1] <- 1
data$V11G1[data$TEMP==2] <- 2
data$V11G1[data$TEMPREAS==1|data$TEMPREAS==4] <- 1

data$V12G1 <- -1
data$V12G1[data$STAPRO==0] <- 1
data$V12G1[data$STAPRO>1&data$STAPRO<9] <- 4

data$V12G2 <- -1
data$V12G2 <- data$V12G1

data$V12G3 <- -1


data$V13G1 <- -1
data$V13G1[data$V12G2==1]<- 3
data$V13G1[data$V10G1==1 & data$STAPRO==3] <- 1
data$V13G1[data$V10G1==2 & data$STAPRO==3] <- 2



data$V13G2 <- -1
data$V13G2[data$V10G1==1 & data$V11G1==1] <- 1
data$V13G2[data$V10G1==1 & data$V11G1==2] <- 2
data$V13G2[data$V10G1==2 & data$V11G1==1] <- 3
data$V13G2[data$V10G1==2 & data$V11G1==2] <- 4
data$V13G2[data$V12G2==1] <- 5

data$V13G3 <- -1
data$V13G3[data$V10G2==1 & data$V11G1==1] <- 1
data$V13G3[data$V10G2==1 & data$V11G1==2] <- 2
data$V13G3[data$V10G2==2 & data$V11G1==1] <- 3
data$V13G3[data$V10G2==2 & data$V11G1==2] <- 4
data$V13G3[data$V12G2==1] <- 5

data$V13G4 <- -1
data$V13G4[data$V10G2==1 & data$V11G1==1] <- 1
data$V13G4[data$V10G2==1 & data$V11G1==2] <- 2
data$V13G4[data$V10G2==2 & data$V11G1==1] <- 3
data$V13G4[data$V10G2==2 & data$V11G1==2] <- 4
data$V13G4[data$V12G2==1] <- 10
data$V13G4[data$STAPRO==4] <- 10

data$V40G1 <- -1

data$V40G2 <- -1

data$V40G3  <-  -1

data$V40G3 <- -1

data$V14G1 <- -1
data$V14G1[data$NACE1D=="A"] <- 1
data$V14G1[data$NACE1D=="B"] <- 1
data$V14G1[data$NACE1D=="C"] <- 2
data$V14G1[data$NACE1D=="D"] <- 3
data$V14G1[data$NACE1D=="E"] <- 3
data$V14G1[data$NACE1D=="F"] <- 4
data$V14G1[data$NACE1D=="G"] <- 5
data$V14G1[data$NACE1D=="H"] <- 6
data$V14G1[data$NACE1D=="I"] <- 7
data$V14G1[data$NACE1D=="J"] <- 14
data$V14G1[data$NACE1D=="K"] <- 8
data$V14G1[data$NACE1D=="L"] <- 8
data$V14G1[data$NACE1D=="M"] <- 9
data$V14G1[data$NACE1D=="N"] <- 10
data$V14G1[data$NACE1D=="O"] <- 11
data$V14G1[data$NACE1D=="P"] <- 12
data$V14G1[data$NACE1D=="Q"] <- 13
data$V14G1[data$NACE1D=="R"] <- 14
data$V14G1[data$NACE1D=="S"] <- 15
data$V14G1[data$NACE1D=="T"] <- 15


data$V15G1 <- -1
data$V15G1[data$ILOSTAT==1] <- 1
data$V15G1[data$ILOSTAT==2] <- 2
data$V15G1[data$ILOSTAT==3] <- 3
data$V15G1[data$ILOSTAT==4] <- 1

data$V16G1 <- -1
data$V16G1[data$V13G2==1] <- 1
data$V16G1[data$V13G2==2] <- 2
data$V16G1[data$V13G2==3] <- 3
data$V16G1[data$V13G2==4] <- 4
data$V16G1[data$V13G2==5] <- 5
data$V16G1[data$V15G1==2] <- 10
data$V16G1[data$V15G1==3] <- 11


data$V17G1 <- -1
data$V17G1[data$MARSTAT==1] <- 1
data$V17G1[data$MARSTAT==2] <- 2
data$V17G1[data$MARSTAT==3] <- 4
data$V17G1[data$MARSTAT==4] <- 4

data$V18G1 <- -1
data$V18G1[data$ISCO3D>99 & data$ISCO3D<200] <- 1
data$V18G1[data$ISCO3D>199 & data$ISCO3D<300] <- 2
data$V18G1[data$ISCO3D>299 & data$ISCO3D<400] <- 3
data$V18G1[data$ISCO3D==410] <- 4
data$V18G1[data$ISCO3D==420] <- 5
data$V18G1[data$ISCO3D==510] <- 6
data$V18G1[data$ISCO3D==520] <- 7
data$V18G1[data$ISCO3D>599 & data$ISCO3D<700] <- 8
data$V18G1[data$ISCO3D==71|data$ISCO3D==72] <- 9
data$V18G1[data$ISCO3D==73] <- 10
data$V18G1[data$ISCO3D==74] <- 11
data$V18G1[data$ISCO3D>799 & data$ISCO3D<900] <- 12
data$V18G1[data$ISCO3D==910] <- 13
data$V18G1[data$ISCO3D==920] <- 14
data$V18G1[data$ISCO3D==930] <- 15


data$V19G1 <- -1
data$V19G1[data$LEAVREAS==00] <-1
data$V19G1[data$LEAVREAS==01] <-3
data$V19G1[data$LEAVREAS==02] <-6
data$V19G1[data$LEAVREAS==03] <-6
data$V19G1[data$LEAVREAS==04] <-8
data$V19G1[data$LEAVREAS==05] <-4
data$V19G1[data$LEAVREAS==06] <-7
data$V19G1[data$LEAVREAS==07] <-7
data$V19G1[data$LEAVREAS==08] <-5
data$V19G1[data$LEAVREAS==09] <-5

data$V20G1 <- -1
data$V20G1[data$FTPTREAS==1] <- 5
data$V20G1[data$FTPTREAS==2] <- 4
data$V20G1[data$FTPTREAS==3] <- 2
data$V20G1[data$FTPTREAS==4] <- 2
data$V20G1[data$FTPTREAS==5] <- 1
data$V20G1[data$FTPTREAS==6] <- 6

data$V21G1 <- -1
data$V21G1[data$V20G1==1] <-1
data$V21G1[data$V20G1==2] <-2
data$V21G1[data$V20G1==3] <-3
data$V21G1[data$V20G1==4] <-4
data$V21G1[data$V20G1==5] <-5
data$V21G1[data$V20G1==6] <-6
data$V21G1[data$V19G1==1] <- 7
data$V21G1[data$V19G1==2] <- 8
data$V21G1[data$V19G1==3] <- 9
data$V21G1[data$V19G1==4] <- 10
data$V21G1[data$V19G1==5] <- 11
data$V21G1[data$V19G1==6] <- 12
data$V21G1[data$V19G1==7] <- 13
data$V21G1[data$V19G1==8] <- 14

data$V22G1 <- -1
data$V22G1[data$DEGURBA==1] <- 2
data$V22G1[data$DEGURBA==2] <- 1
data$V22G1[data$DEGURBA==3] <- 1

data$V23G1 <- -1

data$V24G1 <- -1
data$V24G1[data$SEX==1] <- 1
data$V24G1[data$SEX==2] <- 2

data$V25G1 <- -1

data$V26G1 <- -1
data$V26G1[data$STARTIME >0 & data$STARTIME<24] <- 1
data$V26G1[data$STARTIME >23 & data$STARTIME<61] <- 2
data$V26G1[data$STARTIME >60 & data$STARTIME<109] <- 3
data$V26G1[data$STARTIME >108 & data$STARTIME<156] <- 4
data$V26G1[data$STARTIME >155] <- 5

data$V27G1 <- -1

data$V28G1 <- data$COEFF

data$V29G1 <- -1

data$V29G2 <- 2

data$V30G1 <- -1

data$V31G1 <- -1

data$V32G1 <- -1

data$V33G1 <- -1

data$V34G1 <- -1

data$V35G1 <- -1

data$V36G1 <- -1

data$V37G1 <- -1
data$V37G1[data$SHIFTWK==3] <-  1
data$V37G1[data$EVENWK==1] <- 2
data$V37G1[data$NIGHTWK==1] <- 3


data$V37G2 <- -1
data$V37G1[data$SHIFTWK==3] <-  1
data$V37G1[data$EVENWK==1] <- 2
data$V37G1[data$NIGHTWK==1] <- 2
data$V37G1[data$SATWK==1] <- 2
data$V37G1[data$SUNWK==1] <- 2


data$V41G1 <- -1
data$V41G1[data$EDUSTAT==1] <- 1
data$V41G1[data$EDUSTAT==2] <- 2

data$V42G1 <- -1

data$V43G1 <- -1
data$V43G1[data$V18G1==13] <- 1
data$V43G1[data$V18G1>0 & data$V14G1<14] <- 2
data$V43G1[data$V18G1>14 & data$V14G1<16] <- 2

data$V43G2 <- -1
data$V43G2[data$V43G1==2] <- 3
data$V43G2[data$V43G1==1 & data$V18G1==2] <- 1
data$V43G2[data$V43G1==1 & data$V18G1==3] <- 2
