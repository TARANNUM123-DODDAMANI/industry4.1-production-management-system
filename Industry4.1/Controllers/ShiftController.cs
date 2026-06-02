using Industry4._1.DTOs;
using Industry4._1.Interfaces;
using Industry4._1.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Industry4._1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        public IShiftService _shiftservice;
        public ShiftController(IShiftService shiftservice)
        {
            _shiftservice = shiftservice;
        }


        [HttpPost("AddShift")]
        public IActionResult AddShift(ShiftCreateDto dto)
        {
            var checkStart = _shiftservice.checkStartTime(dto.StartTime, dto.EndTime);
            if( checkStart == false)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = $"Shift Already starts from {dto.StartTime} and end time {dto.EndTime}"
                });
            }

            var shift = _shiftservice.AddShift(dto);

            return Ok(              
                new
                {
                    Status = true,
                    Message = "Shift created successfully",
                    Data = shift
                });
        }

        [HttpGet("{id}")]
        public IActionResult GetShiftById(int id)
        {
            var shift = _shiftservice.GetShiftById(id);

            if (shift == null)
                return NotFound(new
                {
                    Status = false,
                    Message = "Shift not found",

                });

            return Ok(new
            {
                Status = true,
                Message = $"Shift at id: {id}",
                Data = shift
            });
        }

        [HttpGet("GetAllShift")]
        public IActionResult GetAllShift()
        {
            var shifts = _shiftservice.GetAllShift();

            if (shifts == null)
                return NotFound(new
                {
                    Status = false,
                    Message = "No Shift Present",

                });

            return Ok(new
            {
                Status = true,
                Message = $"Total number of Shifts are: {shifts.Count}",
                Data = shifts
            });
        }

        [HttpPatch]
        public IActionResult UpdateShift(Shift dto)
        {
            var result = _shiftservice.UpdateShift(dto);
            if (result == null)
            {
                return BadRequest(new
                {
                    Status = true,
                    Message = $"Shift Not Found with Id: {dto.Id}"
                });
            }
            return Ok(new
            {
                Status = true,
                Message = "Shift Updated Secussfully",
                Data = result
            });
        }


        [HttpDelete]
        public IActionResult DeleteShift(int Id)
        {
            var result = _shiftservice.DeleteShift(Id);
            if (result == null)
            {
                return BadRequest(new
                {
                    Status = true,
                    Message = $"Shift Not Found with Id: {Id}"
                });
            }
            return Ok(new
            {
                Status = true,
                Message = "Shift Deleted Secussfully",
                Data = result
            });
        }



        [HttpGet("ShiftWithSchedule")]
        public IActionResult ShiftWithSchedule() {
            var res = _shiftservice.ShiftWithSchedule();
            return Ok(res);
        }

        [HttpGet("GetShiftName")]
        public IActionResult GetShiftName()
        {
            var res = _shiftservice.GetShiftName();
            return Ok(res);
        }

        [HttpPatch("UpdateShiftStartTime")]
        public IActionResult UpdateShiftStartTime(UpdateShiftStartTime dto)
        {
            var shift = _shiftservice.UpdateShiftStartTime(dto);
            if (shift == null)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = $"Shift not for id{dto.Id}"
                });
            }

            
            return Ok(new
            {
                Status = true,
                Message = "Shift start time Updated secussfully",
                Data = shift
            });
        }
    }
}
