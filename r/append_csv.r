rm(list = ls())

data1 <- read.csv("C:/Users/Peter/Desktop/test/V26G1_A.csv", header=TRUE)
data2 <- read.csv("C:/Users/Peter/Desktop/test/V26G1_B.csv", header=TRUE, row.names=NULL)
data3 <- read.csv("C:/Users/Peter/Desktop/test/V26G1_C.csv", header=TRUE, row.names=NULL)

dataA <- rbind(data1,data2,data3)
write.csv(dataA, "C:/Users/Peter/Desktop/V26G1.csv")

rm(list = ls())

data1 <- read.csv("C:/Users/Peter/Desktop/test/V27G1_A.csv", header=TRUE)
data2 <- read.csv("C:/Users/Peter/Desktop/test/V27G1_B.csv", header=TRUE, row.names=NULL)
data3 <- read.csv("C:/Users/Peter/Desktop/test/V27G1_C.csv", header=TRUE, row.names=NULL)

dataA <- rbind(data1,data2,data3)
write.csv(dataA, "C:/Users/Peter/Desktop/V27G1.csv")