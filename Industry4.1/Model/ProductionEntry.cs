using System.ComponentModel.DataAnnotations;

namespace Industry4._1.Model
{
    public class ProductionEntry
    {
        [Key]
        public int Id { get; set; }
        public string JobId { get; set; }
        public string MachineCode { get; set; }
        public string ShiftName { get; set; }
        public string UserEmployeeId { get; set; }
        public int OkParts { get; set; }
        public int NcParts { get; set; }
        public DateTime EntryTime { get; set; }
    }
}
