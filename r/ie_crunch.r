##ie
rm(list = ls())

myvars <- c("REFYEAR","COUNTRY","AGE","NATIONAL","HATLEVEL","SIZEFIRM","FTPT","HWUSUAL","TEMP","TEMPREAS","STAPRO","NACE1D","ILOSTAT","MARSTAT","ISCO3D","LEAVREAS","FTPTREAS","DEGURBA","SEX","STARTIME","COEFF","SHIFTWK","EVENWK","SATWK","SUNWK","NIGHTWK","EDUCSTAT")

data1 <- read.csv("C:/Users/Peter/Desktop/data/ie1983_y.csv", header=TRUE, row.names=NULL)
data2 <- read.csv("C:/Users/Peter/Desktop/data/ie1984_y.csv", header=TRUE, row.names=NULL)
data3 <- read.csv("C:/Users/Peter/Desktop/data/ie1985_y.csv", header=TRUE, row.names=NULL)
data4 <- read.csv("C:/Users/Peter/Desktop/data/ie1986_y.csv", header=TRUE, row.names=NULL)
data5 <- read.csv("C:/Users/Peter/Desktop/data/ie1987_y.csv", header=TRUE, row.names=NULL)
data6 <- read.csv("C:/Users/Peter/Desktop/data/ie1988_y.csv", header=TRUE, row.names=NULL)
data7 <- read.csv("C:/Users/Peter/Desktop/data/ie1989_y.csv", header=TRUE, row.names=NULL)
data8 <- read.csv("C:/Users/Peter/Desktop/data/ie1990_y.csv", header=TRUE, row.names=NULL)
data9 <- read.csv("C:/Users/Peter/Desktop/data/ie1991_y.csv", header=TRUE, row.names=NULL)
data10 <- read.csv("C:/Users/Peter/Desktop/data/ie1992_y.csv", header=TRUE, row.names=NULL)
data11 <- read.csv("C:/Users/Peter/Desktop/data/ie1993_y.csv", header=TRUE, row.names=NULL)
data12 <- read.csv("C:/Users/Peter/Desktop/data/ie1994_y.csv", header=TRUE, row.names=NULL)
data13 <- read.csv("C:/Users/Peter/Desktop/data/ie1995_y.csv", header=TRUE, row.names=NULL)
data14 <- read.csv("C:/Users/Peter/Desktop/data/ie1996_y.csv", header=TRUE, row.names=NULL)
data15 <- read.csv("C:/Users/Peter/Desktop/data/ie1997_y.csv", header=TRUE, row.names=NULL)
data16 <- read.csv("C:/Users/Peter/Desktop/data/ie1998_y.csv", header=TRUE, row.names=NULL)
data17 <- read.csv("C:/Users/Peter/Desktop/data/ie1999_y.csv", header=TRUE, row.names=NULL)
data18 <- read.csv("C:/Users/Peter/Desktop/data/ie2000_y.csv", header=TRUE, row.names=NULL)
data19 <- read.csv("C:/Users/Peter/Desktop/data/ie2001_y.csv", header=TRUE, row.names=NULL)
data20 <- read.csv("C:/Users/Peter/Desktop/data/ie2002_y.csv", header=TRUE, row.names=NULL)
data21 <- read.csv("C:/Users/Peter/Desktop/data/ie2003_y.csv", header=TRUE, row.names=NULL)
data22 <- read.csv("C:/Users/Peter/Desktop/data/ie2004_y.csv", header=TRUE, row.names=NULL)
data23 <- read.csv("C:/Users/Peter/Desktop/data/ie2005_y.csv", header=TRUE, row.names=NULL)
data24 <- read.csv("C:/Users/Peter/Desktop/data/ie2006_y.csv", header=TRUE, row.names=NULL)

data1 <- data1[myvars]
data2 <- data2[myvars]
data3 <- data3[myvars]
data4 <- data4[myvars]
data5 <- data5[myvars]
data6 <- data6[myvars]
data7 <- data7[myvars]
data8 <- data8[myvars]
data9 <- data9[myvars]
data10 <- data10[myvars]
data11 <- data11[myvars]
data12 <- data12[myvars]
data13 <- data13[myvars]
data14 <- data14[myvars]
data15 <- data15[myvars]
data16 <- data16[myvars]
data17 <- data17[myvars]
data18 <- data18[myvars]
data19 <- data19[myvars]
data20 <- data20[myvars]
data21 <- data21[myvars]
data22 <- data22[myvars]
data23 <- data23[myvars]
data24 <- data24[myvars]

dataA <- rbind(data1,data2,data3,data4,data5,data6,data7,data8,data9,data10,data11,data12,data13,data14,data15,data16,data17,data18,data19,data20,data21,data22,data23,data24)
write.csv(dataA, "C:/Users/Peter/Desktop/output/ie.csv")
