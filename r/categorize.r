data$V1G1 <- -1
data$V1G1[data$AGE_12==1] <- 1
data$V1G1[data$AGE_12==2] <- 2
data$V1G1[data$AGE_12==3] <- 3
data$V1G1[data$AGE_12==4] <- 4
data$V1G1[data$AGE_12==5] <- 5
data$V1G1[data$AGE_12==6] <- 6
data$V1G1[data$AGE_12==7] <- 7
data$V1G1[data$AGE_12==8] <- 8
data$V1G1[data$AGE_12==9] <- 9
data$V1G1[data$AGE_12==10] <- 10
data$V1G1[data$AGE_12==11] <- 11
data$V1G1[data$AGE_12==12] <- 12

data$V1G2[data$V1G1<2 & data$V1G1>0] <- 1
data$V1G2[data$V1G1<9 & data$V1G1>2] <- 2
data$V1G2[data$V1G1>8] <- 3

data$V1G3 <- -1

data$V2G1 <- -1
data$V2G1[data$agyownkn==1] <- 1
data$V2G1[data$agyownkn==2] <- 2
data$V2G1[data$agyownkn==3] <- 3
data$V2G1[data$agyownkn==4] <- 4
data$V2G1[data$agyownkn==5] <- 4
data$V2G1[data$agyownkn==6] <- 5
data$V2G1[data$efamtype==1|data$efamtype==2|data$efamtype==5|data$efamtype==8|data$efamtype==11] <- 0

data$V2G2 <- -1
data$V2G2[data$agyownkn==1] <- 1
data$V2G2[data$agyownkn==2] <- 2
data$V2G2[data$agyownkn==3] <- 3
data$V2G2[data$agyownkn==4] <- 4
data$V2G2[data$agyownkn==5] <- 4
data$V2G2[data$agyownkn==6] <- 5
data$V2G2[data$efamtype==1|data$efamtype==2|data$efamtype==5|data$efamtype==8|data$efamtype==11] <- 0

data$V2G3 <- -1
data$V2G3[data$agyownkn==1] <- 1
data$V2G3[data$agyownkn==2] <- 2
data$V2G3[data$agyownkn==3] <- 3
data$V2G3[data$agyownkn==4] <- 3
data$V2G3[data$agyownkn==5] <- 3
data$V2G3[data$agyownkn==6] <- 3
data$V2G3[data$efamtype==1|data$efamtype==2|data$efamtype==5|data$efamtype==8|data$efamtype==11] <- 0

data$V3G1 <- -1
data$V3G1[data$V2G3 >0] <- 1
data$V3G1[data$V2G3==0] <- 0

data$V3G2 <- -1

data$V4G1 <- -1

data$V5G1 <- -1

data$V6G1 <- -1
data$V6G1[data$efamempl==0] <- 0
data$V6G1[data$efamempl==1] <- 1
data$V6G1[data$efamempl==2] <- 2
data$V6G1[data$efamempl==3] <- 3

data$V7G1 <- -1
data$V7G1[data$educ90==0] <- 1
data$V7G1[data$educ90==1] <- 2
data$V7G1[data$educ90==2] <- 3
data$V7G1[data$educ90==3] <- 3
data$V7G1[data$educ90==4] <- 4
data$V7G1[data$educ90==5] <- 5
data$V7G1[data$educ90==6] <- 5

data$V7G2 <- -1

data$V7G3 <- -1
data$V7G3[data$educ90==0] <- 3
data$V7G3[data$educ90==1] <- 2
data$V7G3[data$educ90==2] <- 2
data$V7G3[data$educ90==3] <- 2
data$V7G3[data$educ90==4] <- 1
data$V7G3[data$educ90==5] <- 1
data$V7G3[data$educ90==6] <- 1

data$V8G1 <- -1
data$V8G1[data$efamtype==1] <- 1
data$V8G1[data$efamtype==2] <- 6
data$V8G1[data$efamtype==3] <- 5
data$V8G1[data$efamtype==4] <- 5
data$V8G1[data$efamtype==5] <- 6
data$V8G1[data$efamtype==6] <- 5
data$V8G1[data$efamtype==7] <- 5
data$V8G1[data$efamtype==8] <- 6
data$V8G1[data$efamtype==9] <- 5
data$V8G1[data$efamtype==10] <- 5
data$V8G1[data$efamtype==11] <- 6
data$V8G1[data$efamtype==12] <- 5
data$V8G1[data$efamtype==13] <- 5
data$V8G1[data$efamtype==14] <- 4
data$V8G1[data$efamtype==15] <- 4
data$V8G1[data$efamtype==16] <- 4
data$V8G1[data$efamtype==17] <- 4
data$V8G1[data$efamtype==18] <- 7

data$V9G1 <- -1
data$V9G1[data$estsize==1] <- 1
data$V9G1[data$estsize==2] <- 2
data$V9G1[data$estsize==3] <- 3
data$V9G1[data$estsize==4] <- 4 

data$V9G2 <- -1
data$V9G2[data$estsize==1] <- 1
data$V9G2[data$estsize==2] <- 2
data$V9G2[data$estsize==3] <- 2
data$V9G2[data$estsize==4] <- 2 

data$V9G3 <- -1

data$V42G1 <- -1
data$V42G1[data$firmsize<3] <- 1
data$V42G1[data$firmsize>2] <- 2

data$V10G1 <- -1
data$V10G1[data$ftptmain==1] <- 1
data$V10G1[data$ftptmain==2] <- 2

data$V10G2 <- -1
data$V10G2[data$uhrsmain>34] <- 1
data$V10G2[data$uhrsmain<35] <- 2

data$V10G3 <- -1
data$V10G3[data$uhrsmain<15] <- 1
data$V10G3[data$uhrsmain<35] <- 2
data$V10G3[data$uhrsmain>34] <- 3

data$V11G1 <- -1
data$V11G1[data$permtemp==1] <- 1
data$V11G1[data$permtemp>1] <- 2

data$V12G1 <- -1
data$V12G1[data$cowmain==1] <- 4
data$V12G1[data$cowmain==2] <- 4
data$V12G1[data$cowmain==3] <- 2
data$V12G1[data$cowmain==4] <- 3
data$V12G1[data$cowmain==5] <- 2
data$V12G1[data$cowmain==6] <- 3
data$V12G1[data$cowmain==7] <- 4

data$V12G2 <- -1
data$V12G2[data$cowmain==1] <- 2
data$V12G2[data$cowmain==2] <- 2
data$V12G2[data$cowmain==3] <- 1
data$V12G2[data$cowmain==4] <- 1
data$V12G2[data$cowmain==5] <- 1
data$V12G2[data$cowmain==6] <- 1
data$V12G2[data$cowmain==7] <- 2

data$V13G1 <- -1
data$V13G1[data$ftptmain==1] <- 1
data$V13G1[data$ftptmain==2] <- 2
data$V13G1[data$cowmain>2 & data$cowmain<7] <- 3

data$V13G2 <- -1
data$V13G2[data$ftptmain==1 & data$permtemp==1] <- 1
data$V13G2[data$ftptmain==1 & data$permtemp==2] <- 2
data$V13G2[data$ftptmain==1 & data$permtemp==3] <- 2
data$V13G2[data$ftptmain==1 & data$permtemp==4] <- 2
data$V13G2[data$ftptmain==2 & data$permtemp==1] <- 3
data$V13G2[data$ftptmain==2 & data$permtemp==2] <- 4
data$V13G2[data$ftptmain==2 & data$permtemp==3] <- 4
data$V13G2[data$ftptmain==2 & data$permtemp==4] <- 4
data$V13G2[data$V13G1==3] <- 5

data$V13G3 <- -1
data$V13G3[data$uhrsmain>34 & data$permtemp==1] <- 1
data$V13G3[data$ftptmain==1 & data$permtemp==2] <- 2
data$V13G3[data$uhrsmain>34 & data$permtemp==3] <- 2
data$V13G3[data$uhrsmain>34 & data$permtemp==4] <- 2
data$V13G3[data$uhrsmain<35 & data$permtemp==1] <- 3
data$V13G3[data$uhrsmain<35 & data$permtemp==2] <- 4
data$V13G3[data$uhrsmain<35 & data$permtemp==3] <- 4
data$V13G3[data$uhrsmain<35 & data$permtemp==4] <- 4
data$V13G3[data$V13G1==3] <- 5

data$V13G4 <- 1
data$V13G4[data$uhrsmain>34 & data$permtemp==1] <- 1
data$V13G4[data$ftptmain==1 & data$permtemp==2] <- 2
data$V13G4[data$uhrsmain>34 & data$permtemp==3] <- 2
data$V13G4[data$uhrsmain>34 & data$permtemp==4] <- 2
data$V13G4[data$uhrsmain<35 & data$permtemp==1] <- 3
data$V13G4[data$uhrsmain<35 & data$permtemp==2] <- 4
data$V13G4[data$uhrsmain<35 & data$permtemp==3] <- 4
data$V13G4[data$uhrsmain<35 & data$permtemp==4] <- 4
data$V13G4[data$cowmain==3|data$cowmain==5] <- 5
data$V13G4[data$cowmain==4|data$cowmain==6] <- 6
data$V13G4[data$cowmain==7] <- 7

data$V40G1 <- -1

data$V40G2 <- -1

data$V40G3 <- -1

data$V40G4 <- data$hrlyearn

data$V14G1 <- -1
data$V14G1[data$naics_43==1] <- 1
data$V14G1[data$naics_43==2] <- 1
data$V14G1[data$naics_43==3] <- 1
data$V14G1[data$naics_43==4] <- 1
data$V14G1[data$naics_43==5] <- 3
data$V14G1[data$naics_43==6] <- 5
data$V14G1[data$naics_43==7] <- 5
data$V14G1[data$naics_43==8] <- 5
data$V14G1[data$naics_43==9] <- 3
data$V14G1[data$naics_43==10] <- 3
data$V14G1[data$naics_43==11] <- 3
data$V14G1[data$naics_43==12] <- 3
data$V14G1[data$naics_43==13] <- 3
data$V14G1[data$naics_43==14] <- 3
data$V14G1[data$naics_43==15] <- 3
data$V14G1[data$naics_43==16] <- 3
data$V14G1[data$naics_43==17] <- 3
data$V14G1[data$naics_43==18] <- 3
data$V14G1[data$naics_43==19] <- 3
data$V14G1[data$naics_43==20] <- 3
data$V14G1[data$naics_43==21] <- 3
data$V14G1[data$naics_43==22] <- 3
data$V14G1[data$naics_43==23] <- 3
data$V14G1[data$naics_43==24] <- 3
data$V14G1[data$naics_43==25] <- 3
data$V14G1[data$naics_43==26] <- 5
data$V14G1[data$naics_43==27] <- 5
data$V14G1[data$naics_43==28] <- 6
data$V14G1[data$naics_43==29] <- 6
data$V14G1[data$naics_43==30] <- 8
data$V14G1[data$naics_43==31] <- 8
data$V14G1[data$naics_43==32] <- 8
data$V14G1[data$naics_43==33] <- 8
data$V14G1[data$naics_43==34] <- 9
data$V14G1[data$naics_43==35] <- 10
data$V14G1[data$naics_43==36] <- 12
data$V14G1[data$naics_43==37] <- 13
data$V14G1[data$naics_43==38] <- 14
data$V14G1[data$naics_43==39] <- 7
data$V14G1[data$naics_43==40] <- 15
data$V14G1[data$naics_43==41] <- 11
data$V14G1[data$naics_43==42] <- 11
data$V14G1[data$naics_43==43] <- 11

data$V15G1 <- -1
data$V15G1[data$lfsstat==1] <- 1
data$V15G1[data$lfsstat==2] <- 1
data$V15G1[data$lfsstat==3] <- 2
data$V15G1[data$lfsstat==4] <- 2
data$V15G1[data$lfsstat==5] <- 2
data$V15G1[data$lfsstat==6] <- 3

data$V16G1 <- -1	

data$V16G1[data$V13G2==1] <- 1
data$V16G1[data$V13G2==2] <- 2
data$V16G1[data$V13G2==3] <- 3
data$V16G1[data$V13G2==4] <- 4
data$V16G1[data$V13G2==5] <- 5
data$V16G1[data$V13G4==7] <- 9
data$V16G1[data$V15G1==2] <- 10
data$V16G1[data$V15G1==3] <- 11

data$V17G1 <- -1
data$V17G1[data$marstat==1] <- 2
data$V17G1[data$marstat==2] <- 3
data$V17G1[data$marstat==3] <- 4
data$V17G1[data$marstat==4] <- 4
data$V17G1[data$marstat==5] <- 4
data$V17G1[data$marstat==6] <- 1

data$V18G1 <- -1
data$V18G1[data$noc01_47==1] <- 1
data$V18G1[data$noc01_47==2] <- 1
data$V18G1[data$noc01_47==3] <- 1
data$V18G1[data$noc01_47==4] <- 1
data$V18G1[data$noc01_47==5] <- 2
data$V18G1[data$noc01_47==6] <- 4
data$V18G1[data$noc01_47==7] <- 4
data$V18G1[data$noc01_47==8] <- 4
data$V18G1[data$noc01_47==9] <- 3
data$V18G1[data$noc01_47==10] <- 5
data$V18G1[data$noc01_47==11] <- 2
data$V18G1[data$noc01_47==12] <- 3
data$V18G1[data$noc01_47==13] <- 2
data$V18G1[data$noc01_47==14] <- 2
data$V18G1[data$noc01_47==15] <- 3
data$V18G1[data$noc01_47==16] <- 6
data$V18G1[data$noc01_47==17] <- 2
data$V18G1[data$noc01_47==18] <- 2
data$V18G1[data$noc01_47==19] <- 4
data$V18G1[data$noc01_47==20] <- 2
data$V18G1[data$noc01_47==21] <- 10
data$V18G1[data$noc01_47==22] <- 7
data$V18G1[data$noc01_47==23] <- 4
data$V18G1[data$noc01_47==24] <- 5
data$V18G1[data$noc01_47==25] <- 13
data$V18G1[data$noc01_47==26] <- 6
data$V18G1[data$noc01_47==27] <- 13
data$V18G1[data$noc01_47==28] <- 6
data$V18G1[data$noc01_47==29] <- 5
data$V18G1[data$noc01_47==30] <- 6
data$V18G1[data$noc01_47==31] <- 7
data$V18G1[data$noc01_47==32] <- 9
data$V18G1[data$noc01_47==33] <- 9
data$V18G1[data$noc01_47==34] <- 12
data$V18G1[data$noc01_47==35] <- 10
data$V18G1[data$noc01_47==36] <- 9
data$V18G1[data$noc01_47==37] <- 11
data$V18G1[data$noc01_47==38] <- 12
data$V18G1[data$noc01_47==39] <- 12
data$V18G1[data$noc01_47==40] <- 15
data$V18G1[data$noc01_47==41] <- 8
data$V18G1[data$noc01_47==42] <- 8
data$V18G1[data$noc01_47==43] <- 15
data$V18G1[data$noc01_47==44] <- 9
data$V18G1[data$noc01_47==45] <- 15
data$V18G1[data$noc01_47==46] <- 15
data$V18G1[data$noc01_47==47] <- 15

data$V19G1 <- -1
data$V19G1[data$whyleftn==1] <- 5
data$V19G1[data$whyleftn==2] <- 8
data$V19G1[data$whyleftn==3] <- 6
data$V19G1[data$whyleftn==4] <- 6
data$V19G1[data$whyleftn==5] <- 6
data$V19G1[data$whyleftn==6] <- 4
data$V19G1[data$whyleftn==7] <- 7
data$V19G1[data$whyleftn==8] <- 2
data$V19G1[data$whyleftn==9] <- 3
data$V19G1[data$whyleftn==10] <- 3
data$V19G1[data$whyleftn==11] <- 2
data$V19G1[data$whyleftn==12] <- 2
data$V19G1[data$whyleftn==13] <- 1

data$V20G1 <- -1
data$V20G1[data$whyptnew==0] <- 6
data$V20G1[data$whyptnew==1] <- 4
data$V20G1[data$whyptnew==2] <- 2
data$V20G1[data$whyptnew==3] <- 2
data$V20G1[data$whyptnew==4] <- 5
data$V20G1[data$whyptnew==5] <- 3
data$V20G1[data$whyptnew==6] <- 1
data$V20G1[data$whyptnew==7] <- 1

data$V21G1 <- -1
data$V21G1[data$V20G1==1] <- 1
data$V21G1[data$V20G1==2] <- 2
data$V21G1[data$V20G1==3] <- 3
data$V21G1[data$V20G1==4] <- 4
data$V21G1[data$V20G1==5] <- 5
data$V21G1[data$V20G1==6] <- 6
data$V21G1[data$V19G2==1] <- 8
data$V21G1[data$V19G2==2] <- 8
data$V21G1[data$V19G2==3] <- 9
data$V21G1[data$V19G2==4] <- 10
data$V21G1[data$V19G2==5] <- 11
data$V21G1[data$V19G2==6] <- 12
data$V21G1[data$V19G2==7] <- 13
data$V21G1[data$V19G2==8] <- 14

data$V22G1 <- -1
data$V22G1[data$cma==1] <- 2
data$V22G1[data$cma==2] <- 2
data$V22G1[data$cma==3] <- 2

data$V23G1 <- -1
data$V23G1[data$cowmain==1] <- 1
data$V23G1[data$cowmain>1 & data$cowmain<8] <- 2

data$V24G1 <- -1
data$V24G1[data$sex==1] <- 1
data$V24G1[data$sex==2] <- 2

data$V25G1 <- -1
data$V25G1[data$efamtype>0 & data$efamtype<14] <- 2
data$V25G1[data$efamtype>13 & data$efamtype<18] <- 1

data$V26G1 <- -1
data$V26G1[data$tenure<=23] <- 1
data$V26G1[data$tenure>23 & data$tenure<71] <- 2
data$V26G1[data$tenure>70 & data$tenure<108] <- 3
data$V26G1[data$tenure>107 & data$tenure<166] <- 4
data$V26G1[data$tenure>167] <- 5

data$V27G1 <- -1
data$V27G1[data$union==1] <- 1
data$V27G1[data$union==2] <- 1
data$V27G1[data$union==3] <- 2

data$V28G1 <- -1
data$V28G1 <- data$fweight

data$V28G2 <- -1

data$V29G1 <- 18

data$V29G2 <- 3

data$V30G1 <- -1

data$V31G1 <- -1

data$V32G1 <- -1

data$V33G1 <- 1

data$V34G1 <- -1

data$V35G1 <- -1

data$V36G1 <- -1

data$V37G1 <- -1

data$V37G2 <- -1

data$V41G1 <- -1

data$V42G1 <- -1

data$V43G1 <- -1
data$V43G1[data$V14G1==13] <- 1
data$V43G1[data$V14G1 >0 & data$V14G1<13] <- 2
data$V43G1[data$V14G1>13] <- 2

data$V43G2 <- -1
data$V43G2[data$V14G1==13 & data$V18G1==2] <- 1
data$V43G2[data$V14G1==13 & data$V18G1==3] <- 2
data$V43G2[data$V43G1==2]

data$V44G1 <- -1

data$V44G2 <- -1
