namespace Industry4._1.DTOs
{
    public class ShiftCreateDto
    {

        public string ShiftName { get; set; }


        public TimeSpan StartTime { get; set; }


        public TimeSpan EndTime { get; set; }


    }

    public class GetShiftNameResponse
    {

        public string ShiftName { get; set; }


        

    }
    public class UpdateShiftStartTime
    {
        public int Id { get; set; }

        public TimeSpan StartTime { get; set; }
    }
}
