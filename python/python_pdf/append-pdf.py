import PyPDF2
from tkinter import *
from tkinter import filedialog

# Variables
pdf2merge = []
pdfWriter = PyPDF2.PdfFileWriter()

# GUI Window
root = Tk()
root.update()
root.withdraw()

# User Input
number_to_merge = input("How many PDF files to merge?  ")
number_to_merge = int(number_to_merge)

# Where is the PDF files?
for x in range(number_to_merge):
	pdf_to_merge = filedialog.askopenfilename()
	root.withdraw()
	root.update()
	pdf2merge.append(pdf_to_merge)

# Where to save the merged PDF?
userfilename = filedialog.asksaveasfilename()

# Loop though all the PDF files

for filename in pdf2merge:
	# rb for read binary
	pdfFileObj = open(filename, 'rb')
	'''
	pdf1File = open('Download_01.pdf', 'rb')
	pdf2File = open('Download_02.pdf', 'rb')
	pdf3File = open('Download_03.pdf', 'rb')
	pdf4File = open('Download_04.pdf', 'rb')
	pdf5File = open('Download_05.pdf', 'rb')
	'''
	pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
	'''
	pdf1Reader = PyPDF2.PdfFileReader(pdf1File)
	pdf2Reader = PyPDF2.PdfFileReader(pdf2File)
	pdf3Reader = PyPDF2.PdfFileReader(pdf3File)
	pdf4Reader = PyPDF2.PdfFileReader(pdf4File)
	pdf5Reader = PyPDF2.PdfFileReader(pdf5File)
	'''
	for pageNum in range(pdfReader.numPages):
		pageObj = pdfReader.getPage(pageNum)
		pdfWriter.addPage(pageObj)

	'''
	for pageNum in range(pdf1Reader.numPages):
		pageObj = pdf1Reader.getPage(pageNum)
		pdfWriter.addPage(pageObj)

	for pageNum in range(pdf2Reader.numPages):
		pageObj = pdf2Reader.getPage(pageNum)
		pdfWriter.addPage(pageObj)

	for pageNum in range(pdf3Reader.numPages):
		pageObj = pdf3Reader.getPage(pageNum)
		pdfWriter.addPage(pageObj)

	for pageNum in range(pdf4Reader.numPages):
		pageObj = pdf4Reader.getPage(pageNum)
		pdfWriter.addPage(pageObj)

	for pageNum in range(pdf5Reader.numPages):
		pageObj = pdf5Reader.getPage(pageNum)
		pdfWriter.addPage(pageObj)
	'''
# Save PDF to file, wb for write binary
pdfOutputFile = open(userfilename + ".pdf", "wb")

# Output PDF file
pdfWriter.write(pdfOutputFile)

# Close PDF writer
pdfOutputFile.close()

'''
pdf1File.close()
pdf2File.close()
pdf3File.close()
pdf4File.close()
pdf5File.close()
'''
# Close GUI Window
root.destroy()

print("Finished")
