# Comannd line usage:
# python pdf_insert.py --original "book.pdf" --insert "page.pdf" --index 2 --output "output.pdf"

import argparse
import PyPDF2

def insert_pdf_after_page(original_pdf_path, insert_pdf_path, output_pdf_path, insert_after_page):
    # Open the original PDF file
    with open(original_pdf_path, 'rb') as original_file:
        original_pdf = PyPDF2.PdfReader(original_file)

        # Open the PDF file to be inserted
        with open(insert_pdf_path, 'rb') as insert_file:
            insert_pdf = PyPDF2.PdfReader(insert_file)

            # Create a new PDF writer object
            pdf_writer = PyPDF2.PdfWriter()

            # Add pages from the original PDF up to the specified page
            for page_num in range(insert_after_page):
                page = original_pdf.pages[page_num]
                pdf_writer.add_page(page)

            # Add pages from the PDF to be inserted
            for page_num in range(len(insert_pdf.pages)):
                page = insert_pdf.pages[page_num]
                pdf_writer.add_page(page)

            # Add remaining pages from the original PDF
            for page_num in range(insert_after_page, len(original_pdf.pages)):
                page = original_pdf.pages[page_num]
                pdf_writer.add_page(page)

            # Write the combined PDF to the output file
            with open(output_pdf_path, 'wb') as output_file:
                pdf_writer.write(output_file)

def main():
    # Create an argument parser
    parser = argparse.ArgumentParser(description='Insert a PDF file after a specified page of another PDF file.')

    # Add command-line arguments
    parser.add_argument('--original', '-o', required=True, help='Path to the original PDF file')
    parser.add_argument('--insert', '-i', required=True, help='Path to the PDF file to be inserted')
    parser.add_argument('--output', '-out', required=True, help='Path to the output PDF file')
    parser.add_argument('--index', '-idx', type=int, required=True, help='Page number after which to insert the PDF')

    # Parse the command-line arguments
    args = parser.parse_args()

    # Call the function to insert the PDF
    insert_pdf_after_page(args.original, args.insert, args.output, args.index)

if __name__ == "__main__":
    main()

