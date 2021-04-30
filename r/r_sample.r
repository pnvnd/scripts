data <- read.csv("C:/Users/Peter/Desktop/data/1997c.csv")

source("C:\\Users\\Peter\\Desktop\\cdn_lfs.r")

table <- c("V12G1", "CASE_ID", "SURVYEAR")
var <- data[table]
write.csv(var, "C:/Users/Peter/Desktop/1997/table.csv", row.names=FALSE)

noc01_47 <- c("V43G2", "CASE_ID", "SURVYEAR")
data62 <- data[noc01_47]
write.csv(data62, "C:/Users/Peter/Desktop/V43G2.csv", row.names=FALSE)

noc01_47 <- c("V44G1", "CASE_ID", "SURVYEAR")
data63 <- data[noc01_47]
write.csv(data63, "C:/Users/Peter/Desktop/V44G1.csv", row.names=FALSE)

noc01_47 <- c("V44G2", "CASE_ID", "SURVYEAR")
data64 <- data[noc01_47]
write.csv(data64, "C:/Users/Peter/Desktop/V44G2.csv", row.names=FALSE)