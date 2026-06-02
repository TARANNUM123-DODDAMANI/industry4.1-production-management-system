namespace Industry4._1.DTOs.MachineDto
{
    public class MachineCodeDto
    {
       
        public string MachineCode { get; set; }
    }
    public class GetAllMachinesStatusResponseDto
    {
        public int Id {  get; set; }
        public string MachineCode { get; set; }
        public bool IsActive {  get; set; }
    }
}
