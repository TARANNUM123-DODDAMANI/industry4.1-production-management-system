using Industry4._1.DTOs;
using Industry4._1.Model;

namespace Industry4._1.Interfaces
{
    public interface IProductionService
    {
        public ProductionEntry ProductinAlreadypresent(string JobId);
        public Machine checkMachine(string MachineCode);
        public List<MachineSummaryDto> machinesummary1();
        public Shift checkShift(string ShiftName);
        public AppUser checkUser(string EmployeeId);
        public ProductionEntry AddProduction(ProductionCreateDto dto);
        public List<ProductionResponseDto> Get();
        public List<ProductionResponseDto> GetByShift(string shiftName);



        public ProductionEntry GetByProductId(int PrudID);
        public ProductionEntry DeleteProduction(string jobId);
        public int TotalOKCount();
        public int TotalNCCount();
        public TotalOKCountFromMachineResponse TotalOKCountFromMachine(string machineCode);

        public TotalOKCountFromMachinedateResponse TotalOKCountFromMachinedate(string machineCode, DateTime from, DateTime to);
        public TotalOKCountFromMachineAndEmployeedateResponse TotalOKCountFromMachineAndEmployeedate(TotalOKCountFromMachineAndEmployeedateDto dto);
        public List<machinesummaryResponse> machinesummary();
        public List<RoleSummaryResponseDto> RoleSummary();
        public List<ShiftSummaryResponseDto> ShiftSummary();
        public List<operatorperformanceDto> operatorperformance();
        public ProductionEntry UpdateProduction(UpdateProductionDto dto);
        public List<resultResponseDto> ShiftReport();
        public operatorperformanceDto1 operatorperformance1();
        public dailyResponseDto daily(DateOnly date);

       
        public TopMachineResponseDto TopMachine();
        public ProductionbyMachineUserPerCycleResponseDto ProductionbyMachineUserPerCycle(GetMachineandUserProduction dto);
        public List<MachineUser1ResponseDto> MachineUser1(MachineUser dto);
        public MachineUser2ResponseDto MachineUser2(MachineUser dto);
    }
}
