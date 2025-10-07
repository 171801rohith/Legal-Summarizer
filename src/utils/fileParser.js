// src/utils/fileParser.js

// Mock PDF parsing function
export const parsePDF = async (file) => {
  // For MVP, we'll simulate PDF text extraction
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock legal text for demonstration
  return `IN THE HIGH COURT OF DELHI AT NEW DELHI

CIVIL WRIT PETITION NO. 12345 OF 2023

IN THE MATTER OF:

RAM KUMAR SHARMA
PETITIONER
VS.

UNION OF INDIA & ORS.
RESPONDENTS

JUDGMENT

The Hon'ble Mr. Justice A.K. Sharma pronounced the judgment:

This writ petition has been filed under Article 226 of the Constitution of India seeking quashing of the impugned order dated 15.03.2023 passed by the Income Tax Appellate Tribunal.

The petitioner, Ram Kumar Sharma, is an individual engaged in the business of manufacturing and has challenged the assessment order for the financial year 2020-21. The primary contention of the petitioner is that the assessing officer failed to consider the documentary evidence submitted regarding business expenses.

The respondents, represented by the learned Additional Solicitor General, have vehemently opposed the petition arguing that the petitioner failed to maintain proper books of accounts as mandated under Section 44AA of the Income Tax Act, 1961.

After hearing learned counsel for both parties and perusing the material on record, this Court finds that the assessing officer has indeed not properly considered the documentary evidence submitted by the petitioner. The order suffers from non-application of mind.

The Hon'ble Court held that natural justice has been violated in this case as the petitioner was not given adequate opportunity to present his case. The principle of audi alteram partem must be followed in all quasi-judicial proceedings.

Reference was made to the Supreme Court judgment in Commissioner of Income Tax vs. XYZ Limited (2018) which emphasized the importance of providing reasonable opportunity to assessees.

In view of the above, the impugned order dated 15.03.2023 is hereby quashed and set aside. The matter is remanded back to the assessing officer for fresh consideration. The assessing officer shall provide the petitioner with a proper hearing and consider all documentary evidence afresh.

The petitioner shall appear before the assessing officer on 15th December, 2023. The assessing officer shall pass a fresh order within three months from that date.

The writ petition is accordingly allowed with no order as to costs.

Let a copy of this judgment be communicated to both parties.

Sd/-
(A.K. SHARMA)
JUDGE

Dated: 10th November, 2023`;
}

// Mock DOCX parsing function
export const parseDOCX = async (file) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "This is a mock DOCX document content. Please use PDF or text input for the MVP version.";
}

// Enhanced key section extraction for legal documents
export const extractKeySections = (text) => {
  const sections = [];
  
  // Extract verdict/judgment
  const verdictMatch = text.match(/(writ petition|appeal).*?(allowed|dismissed|disposed).*?\./is);
  if (verdictMatch) {
    sections.push({
      type: 'verdict',
      content: verdictMatch[0].substring(0, 150) + '...',
      relevance: 'High'
    });
  }
  
  // Extract parties
  const partyMatch = text.match(/(petitioner|appellant).*?vs\..*?respondent.*?\./is);
  if (partyMatch) {
    sections.push({
      type: 'parties',
      content: partyMatch[0].substring(0, 100),
      relevance: 'High'
    });
  }
  
  // Extract legal sections
  const sectionMatches = text.match(/(Section|Article)\s+\d+[A-Za-z]*\s+of\s+[A-Za-z\s]+Act/gi);
  if (sectionMatches) {
    sectionMatches.forEach(match => {
      sections.push({
        type: 'legal_sections',
        content: match,
        relevance: 'Medium'
      });
    });
  }
  
  // Extract key dates
  const dateMatch = text.match(/(appear|hearing).*?\d{1,2}(th|st|nd|rd)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i);
  if (dateMatch) {
    sections.push({
      type: 'dates',
      content: dateMatch[0],
      relevance: 'Medium'
    });
  }
  
  // Extract court information
  const courtMatch = text.match(/(High Court|Supreme Court|District Court).*?([A-Z][a-z]+)/);
  if (courtMatch) {
    sections.push({
      type: 'court',
      content: courtMatch[0],
      relevance: 'Medium'
    });
  }
  
  // If no specific sections found, create generic highlights
  if (sections.length === 0) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 30);
    sections.push(
      {
        type: 'key_point',
        content: sentences[0]?.substring(0, 120) + '...' || 'Main subject of the document',
        relevance: 'High'
      },
      {
        type: 'key_point', 
        content: sentences[1]?.substring(0, 120) + '...' || 'Primary arguments presented',
        relevance: 'High'
      }
    );
  }
  
  return sections.slice(0, 5); // Return max 5 sections
}

// Sample document loader function
export const loadSampleDocument = (type = 'medium') => {
  const sampleLegalDocuments = {
    short: `IN THE SUPREME COURT OF INDIA
Civil Appeal No. 4567 of 2023
  
John Doe vs. State of Maharashtra
  
The appeal is allowed. The impugned judgment of the High Court is set aside. The appellant shall be entitled to compensation as per Section 357 of CrPC.`,
    
    medium: `IN THE HIGH COURT OF DELHI
Writ Petition (Civil) No. 1234 of 2023
  
Ram Kumar Sharma ... Petitioner
Vs.
Union of India ... Respondent
  
JUDGMENT
  
The petitioner challenged the constitutional validity of Section 12(3) of the Income Tax Act. The court held that the provision does not violate Article 14 of the Constitution. The petition is dismissed. No costs.`,
    
    long: `IN THE SUPREME COURT OF INDIA
Civil Appeal No. 7890 of 2023
  
M/S Sharma Enterprises ... Appellant
Vs.
Commissioner of Income Tax ... Respondent
  
JUDGMENT
  
This appeal arises from the judgment of the High Court dated 15.03.2023. The appellant is a private limited company engaged in manufacturing. The dispute pertains to the assessment year 2020-21.
  
The primary issue is whether the expenses claimed under Section 37(1) of the Income Tax Act, 1961 are admissible. The assessing officer disallowed the claims citing lack of proper documentation.
  
The appellant contended that all necessary documents were submitted and the disallowance is arbitrary. The respondent argued that the appellant failed to maintain books of accounts as required under Section 44AA.
  
After considering the arguments and examining the material on record, we find that the assessing officer has not given proper reasons for disallowing the expenses. The principle of natural justice requires that adequate opportunity be given to the assessee.
  
Reference is made to the Constitution Bench judgment in Commissioner of Income Tax vs. ABC Limited (2015) which emphasized the importance of reasoned orders in tax matters.
  
In view of the above, the appeal is allowed. The matter is remanded back to the assessing officer for fresh consideration. The assessing officer shall provide a proper hearing to the appellant and pass a reasoned order within three months.
  
No order as to costs.`
  };
  
  return sampleLegalDocuments[type] || sampleLegalDocuments.medium;
}