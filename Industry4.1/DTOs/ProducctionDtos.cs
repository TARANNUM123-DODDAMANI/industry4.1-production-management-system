using System.ComponentModel.DataAnnotations;

namespace Industry4._1.DTOs
{
    public class ProductionCreateDto
    {
        public string MachineCode { get; set; }

        public string JobId { get; set; }
        public string ShiftName { get; set; }


        public string UserEmployeeId { get; set; }


        public int OkParts { get; set; }


        public int NcParts { get; set; }
    }
    public class ProductionResponseDto
    {
        public int Id {  get; set; }
                    public string MachineName {  get; set; }

                  public string ShiftName {  get; set; }
                    public string EmployeeId {  get; set; }
                    public int OkParts { get; set; }
                    public int NcParts { get; set; }
        public string JobId { get; set; }
        public DateTime EntryTime { get; set; }

    }

    public class TotalOKCountFromMachineResponse
    {
        public string MachineCode { get; set; }
        public int TotalOkParts {  get; set; }
        public int TotalNcParts {  get; set; }
        public int TotalProduction {  get; set; }
    }

    public class TotalOKCountFromMachinedateResponse
    {
        public string MachineCode { get; set; }
        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }

    }

    public class TotalOKCountFromMachineAndEmployeedateResponse
    {
        public string EmployeeId { get; set; }
        public string MachineCode { get; set; }
        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }

    }

    public class TotalOKCountFromMachineAndEmployeedateDto
    {
        public string EmployeeId { get; set; }
        public string MachineCode { get; set; }
        
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }

    }

    public class machinesummaryResponse
    {
        public string Machine { get; set; }
        
        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }

    }

    public class RoleSummaryResponseDto
    {
        public string Role { get; set; }

        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }

    }

    public class ShiftSummaryResponseDto
    {
        public string Shift { get; set; }

        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }

    }
    public class MachineSummaryDto
    {
        public string Machine { get; set; }
        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }
    }
    public class operatorperformanceDto
    {
        public string EmployeeId { get; set; }
        public int TotalOKParts { get; set; }
        public int TotalNCParts { get; set; }
        public int TotalParts { get; set; }
        
        public double Performance {  get; set; }
    }


    public class operatorperformanceDto1
    {
        public string user { get; set; }
        public int totalOkParts { get; set; }
       
    }
    public class UpdateProductionDto
    {
        public string JobId { get; set; }
        public string MachineCode { get; set; }
        public string ShiftName { get; set; }
        public string UserEmployeeId { get; set; }
        public int OkParts { get; set; }
        public int NcParts { get; set; }
        public DateTime EntryTime { get; set; }
    }

    public class resultResponseDto
    {
        public string shift { get; set; }
        //public string MachineName { get; set; }
        //public string EmployeeID {  get; set; }

        public int totalOk { get; set; }
        public int totalNc { get; set; }
        //public int TotalParts { get; set; }

        //public double Performance { get; set; }
    }

    public class dailyResponseDto
    {
        public DateOnly Date {  get; set; }
        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }
       
    }

    public class TopMachineResponseDto
    {
        public string MachineCode { get; set; }
       
        public int TotalProduction { get; set; }
    }

    public class GetMachineandUserProduction
    {
        public string MachineCode { get; set; }
        public string EmployeeId { get; set; }
        public DateTime from { get; set; }
        public DateTime to { get; set; }
    }

    public class ProductionbyMachineUserPerCycleResponseDto
    {
        public string MachineCode { get; set; }
        public string EmployeeId { get; set; }
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
        public int TotalOkParts { get; set; }
        public int TotalNcParts { get; set; }
        public int TotalProduction { get; set; }
    }

    public class MachineUser
    {
        public string MachineCode { get; set; }
        public string EmployeeId { get; set; }
    }

    public class MachineUser1ResponseDto
    {
        public  string OperatorID {  get; set; }
    }

    public class MachineUser2ResponseDto
    {
        public int OperatorID { get; set; }
        public string OperatorEID { get; set; }
        public string OperatorRole { get; set; }

        public bool OperatorStatus { get; set; }
    }
}
