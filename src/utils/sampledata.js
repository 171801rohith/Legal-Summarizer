// src/utils/sampleData.js
export const sampleLegalDocuments = {
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
}

// Add a function to load sample data
export const loadSampleDocument = (type = 'medium') => {
  return sampleLegalDocuments[type] || sampleLegalDocuments.medium;
}