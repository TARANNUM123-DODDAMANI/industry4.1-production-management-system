using Industry4._1.DTOs;
using Industry4._1.Model;

namespace Industry4._1.Interfaces
{
    public interface IShiftService
    {
        public Shift AddShift(ShiftCreateDto dto);
        public Shift GetShiftById(int id);
        public List<Shift> GetAllShift();
        public Shift UpdateShift(Shift shift);
        public Shift DeleteShift(int Id);
        public bool checkStartTime(TimeSpan StartTime, TimeSpan EndTime);
        public List<string> ShiftWithSchedule();
        public List<GetShiftNameResponse> GetShiftName();
        public Shift UpdateShiftStartTime(UpdateShiftStartTime dto);
    }
}