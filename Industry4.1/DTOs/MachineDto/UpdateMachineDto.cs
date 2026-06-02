namespace Industry4._1.DTOs.MachineDto
{
    public class UpdateMachineDto
    {
        public int Id { get; set; }
        public string MachineCode { get; set; }
        public string MachineName { get; set; }
        public bool IsActive { get; set; }
        public int employeesWorking { get; set; }
    }
}
