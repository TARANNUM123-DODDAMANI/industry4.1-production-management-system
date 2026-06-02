using Industry4._1.Data;
using Industry4._1.DTOs;
using Industry4._1.Interfaces;
using Industry4._1.Model;
using Microsoft.AspNetCore.Mvc;

namespace Industry4._1.Services
{
    public class ShiftService: IShiftService
    {
        private readonly AppDBContext _context;

        public ShiftService(AppDBContext context)
        {
            _context = context;
        }

        public bool checkStartTime(TimeSpan StartTime, TimeSpan EndTime)
        {
            var res = _context.Shifts.FirstOrDefault( s => s.StartTime == StartTime && s.EndTime == EndTime);

            return res == null;
        }


        public Shift AddShift(ShiftCreateDto dto)
        {
            var shift = new Shift
            {
                ShiftName = dto.ShiftName,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.Shifts.Add(shift);
            _context.SaveChanges();

            return shift;
        }

       
        public Shift GetShiftById(int id)
        {
            var shift = _context.Shifts
                .Where(s => s.Id == id)
                .Select(s => new Shift
                {
                   Id= s.Id,
                    ShiftName= s.ShiftName,
                    StartTime=  s.StartTime,
                    EndTime = s.EndTime
                })
                .FirstOrDefault();

            if (shift == null)
                return null;

            return shift;
        }



        public List<Shift> GetAllShift()
        {
            var shifts = _context.Shifts
                .Select(s => new Shift
                {
                    Id=s.Id,
                    ShiftName=s.ShiftName,
                    StartTime=s.StartTime,
                    EndTime= s.EndTime
                })
                .ToList();

            if (shifts == null)
                return null;

            return shifts;
        }

        public Shift UpdateShift(Shift shift)
        {
            var shifts = _context.Shifts.FirstOrDefault( s => s.Id == shift.Id);
            if (shifts == null)
            {
                return null;
            }
            shifts.ShiftName = shift.ShiftName;
            shifts.StartTime = shift.StartTime;
            shifts.EndTime = shift.EndTime;
            _context.SaveChanges();
            return shifts;
        }

        public Shift DeleteShift(int Id)
        {
            var shifts = _context.Shifts.FirstOrDefault(s => s.Id == Id);
            if (shifts == null)
            {
                return null;
            }
            _context.Shifts.Remove(shifts);
            _context.SaveChanges();
            return shifts;
        }

        public List<string> ShiftWithSchedule()
        {
            
            var shifts1 = _context.Shifts
        .Select(s => $"{s.ShiftName} = {s.StartTime} - {s.EndTime}")
        .ToList();
            return shifts1;
        }
        

        public List<GetShiftNameResponse> GetShiftName()
        {
            var shifts = _context.Shifts
                .Select(s => new GetShiftNameResponse
                {
                    
                    ShiftName = s.ShiftName
                    
                })
                .ToList();

            if (shifts == null)
                return null;

            return shifts;
        }


        public Shift UpdateShiftStartTime(UpdateShiftStartTime dto)
        {
            var shift = _context.Shifts.Where(i => i.Id == dto.Id).FirstOrDefault();
            if (shift == null)
            {
                return null;
            }

            shift.StartTime = dto.StartTime;
            _context.SaveChanges();
            return shift;

        }
    }
}
