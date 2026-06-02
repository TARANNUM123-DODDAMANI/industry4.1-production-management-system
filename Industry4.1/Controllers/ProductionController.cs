using Industry4._1.DTOs;
using Industry4._1.Interfaces;
using Industry4._1.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Industry4._1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductionController : ControllerBase
    {
        public IProductionService _productionservice;
        public ProductionController(IProductionService productionservice)
        {
            _productionservice = productionservice;
        }

        [HttpPost]
        public IActionResult AddProduction(ProductionCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ProdEntryAlredy = _productionservice.ProductinAlreadypresent(dto.JobId);

            if (ProdEntryAlredy != null)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = "Production entry already present"
                });
            }

            var machine = _productionservice.checkMachine(dto.MachineCode);
            if (machine == null)
                return BadRequest("Invalid Machine");

            var shift = _productionservice.checkShift(dto.ShiftName);
            if (shift == null)
                return BadRequest("Invalid Shift");

            var user = _productionservice.checkUser(dto.UserEmployeeId);
            if (user == null)
                return BadRequest("Invalid User");

            var production = _productionservice.AddProduction(dto);

            return Ok(new
            {
                Status = true,
                Message = "Production entry added successfully",
                Data = production
            });
        }


        [HttpGet]
        public IActionResult Get()
        {
            var result = _productionservice.Get();
            return Ok(new
            {
                Status = true,
                Message = $"Number of Production entry are {result.Count}",
                Data = result
            });
        }


        [HttpGet("Shift/{shiftName}")]
        public IActionResult GetByShift(string shiftName)
        {
            var result = _productionservice.GetByShift(shiftName);

            if (result.Count == 0)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = $"No Production entry at Shift fount of ShiftId: {shiftName}"
                });
            }

            return Ok(new
            {
                Status = true,
                Message = $"Production entry at Shift of ShiftId: {shiftName}",
                Data = result
            });
        }

        [HttpGet("GetByProductId/{PrudID}")]
        public IActionResult GetByProductId(int PrudID)
        {
            var result = _productionservice.GetByProductId(PrudID);

            if (result == null)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = $"No Production entry at Shift fount of ShiftId: {PrudID}"
                });
            }

            return Ok(new
            {
                Status = true,
                Message = $" Production entry at Shift of ShiftId: {PrudID}",
                Data = result
            });
        }

        [HttpDelete("ByJobId")]
        public IActionResult DeleteProduction(string jobId)
        {
            var res = _productionservice.DeleteProduction(jobId);
            if (res == null)
            {
                return NotFound(new
                {
                    Status = false,
                    Message = $"JobID not found for JobID: {jobId}"
                });
            }
            return Ok(new
            {
                Status = true,
                Message = $"Production Entry deleted of JobID: {jobId}",
                Data = res
            });
        }

        [HttpPatch("UpdateProductionEntry")]
        public IActionResult UpdateProductionEntry(UpdateProductionDto dto)
        {
            var machine = _productionservice.checkMachine(dto.MachineCode);
            if (machine == null)
                return BadRequest("Invalid Machine");

            var shift = _productionservice.checkShift(dto.ShiftName);
            if (shift == null)
                return BadRequest("Invalid Shift");

            var user = _productionservice.checkUser(dto.UserEmployeeId);
            if (user == null)
                return BadRequest("Invalid User");

            var res = _productionservice.UpdateProduction(dto);
            if (res == null)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = "JobId not Found"
                });
            }
            return Ok(new
            {
                Status = true,
                Message = "Production Entry updated secussfully",
                Data = res
            });
        }


        [HttpGet("TotalOKCount")]
        public IActionResult TotalOKCount()
        {
            var totalOk = _productionservice.TotalOKCount();
            return Ok(new
            {
                TotalOkCount = totalOk
            });
        }

        [HttpGet("TotalNcCount")]
        public IActionResult TotalNcCount()
        {
            var totalNc = _productionservice.TotalNCCount();
            return Ok(new
            {
                TotalOkCount = totalNc
            });
        }


        [HttpGet("TotalOKCountFromMachine")]
        public IActionResult TotalOKCountFromMachine(string machineCode)
        {
            var totalOk = _productionservice.TotalOKCountFromMachine(machineCode);
            if (totalOk == null) return NotFound(new {
                Status = false,
                message = "Production Not Found for this machine"
            });

            return Ok(new
            {
                Status = true,
                message = "Total Ok & Nc Counts of Machine fetched Secussfully",
                data = totalOk
            });
        }

        [HttpGet("TotalOkNcCountFromMachineFromTodate")]
        public IActionResult TotalOKCountFromMachinedate(string machineCode, DateTime from, DateTime to)
        {
            var production = _productionservice.TotalOKCountFromMachinedate(machineCode, from, to);
            if (production == null) return NotFound(new
            {
                Status = false,
                message = "Production Not Found for this machine for this cycle"
            });
            return Ok(new
            {
                Status = true,
                message = "Total Ok & Nc Counts of Machine specific Date to  specific Date fetched Secussfully",
                data = production
            });
        }

        [HttpGet("TotalOkNcCountFromMachineAndEmployeeFromTodate")]
        public IActionResult TotalOkNcCountFromMachineAndEmployeeFromTodate(TotalOKCountFromMachineAndEmployeedateDto dto)
        {
            var production = _productionservice.TotalOKCountFromMachineAndEmployeedate(dto);
            if (production == null) return NotFound(new
            {
                Status = false,
                message = "Production Not Found for this machine and Employee for given cycle"
            });
            return Ok(new
            {
                Status = true,
                message = "Total Ok & Nc Counts of Machine & Employee from specific Date to  specific Date fetched Secussfully",
                data = production
            });
        }

        //[HttpGet("machine-summary")]
        //public IActionResult machinesummary()
        //{
        //    var result = _productionservice.machinesummary();

        //    if (result.Count == 0)
        //    {
        //        return NoContent();
        //    }

        //    return Ok(new
        //    {
        //        Status = true,
        //        Message = "Details of Production According to Machine",
        //        Data = result
        //    });
        //}

        [HttpGet("machine-summary")]
        public IActionResult machinesummary1()
        {
            var result = _productionservice.machinesummary1();

            if (result == null || !result.Any())
            {
                return NoContent();
            }

            return Ok(new
            {
                Status = true,
                Message = "Details of Production According to Machine",
                Data = result
            });
        }


        [HttpGet("operator-performance")]
        public IActionResult operatorperformance()
        {
            var result = _productionservice.operatorperformance();


            if (result.Count == 0)
            {
                return NoContent();
            }

            return Ok(new
            {
                Status = true,
                Message = "Details of Production According to User",
                Data = result
            });
        }



        [HttpGet("operator-ranking")]
        public IActionResult operatorRanking()
        {
            var result = _productionservice.operatorperformance1();


           
            return Ok(new
            {
                Status = true,
                Message = "Top Operator",
                Data = result
            });
        }



        [HttpGet("shift-summary")]
        public IActionResult ShiftReport()
        {
            var result = _productionservice.ShiftReport();

            if (result== null)
                return BadRequest(new
                {
                    Status = false,
                    message = "Production Not Found for this shiftName"

                });

            return Ok(new
            {
                Status = true,
                Message = "Details of Production According to Shift",
                Data = result
            });
        }

        [HttpGet("daily-report")]
        public IActionResult DailyReport(DateOnly date)
        {
            var result = _productionservice.daily(date);

            if (result == null)
            {
                return BadRequest(new
                {
                    Status = true,
                    Message = "No Daily Production "
                });
            }

            return Ok(new
            {
                Status = true,
                Message = "Daily Production Report",
                Data = result
            });
        }


        [HttpGet("top-machine")]
        public IActionResult TopMachine()
        {
            var result = _productionservice.TopMachine();

            if (result == null)
            {
                return NoContent();
            }

            return Ok(new
            {
                Status = true,
                Message = "Top performing machine",
                Data = result
            });
        }


        [HttpPost("Production-by-Machine-User-PerCycle")]
        public IActionResult ProductionbyMachineUserPerCycle(GetMachineandUserProduction dto)
        {


            var production = _productionservice.ProductionbyMachineUserPerCycle( dto );

            if (production == null)
            {
                return BadRequest(new
                {
                    Status = false,
                    message = "Production Not Found"

                });
            }

            return Ok(new
            {
                Status = true,
                Message = "Data fetch Secussfully",
                Data = production
            });
        }

        [HttpPost("MachineUser")]
        public IActionResult MachineUser(MachineUser dto)
        {
            var result = _productionservice.MachineUser1( dto );


            var result1 = _productionservice.MachineUser2(dto);


            if (result1 != null)
            {
                return Ok(new
                {
                    Status = true,
                    Message = "Operstor Details feched successfully",
                    Data = result1
                });
            }


            if (dto.EmployeeId != "" && result1 == null)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = $"Operator with operatorId: {dto.EmployeeId} Not found for Machine with machineId: {dto.MachineCode} ",

                });
            }



            if (result.Count == 0)
            {
                return BadRequest(new
                {
                    Status = false,
                    Message = "Machine Not found"
                });
            }

            return Ok(new
            {
                Status = true,
                Message = $"Number of Operators work for Machine of machineID: {dto.MachineCode} are {result.Count}",
                Data = result
            });
        }
        [HttpGet("RoleSummary")]
        public IActionResult RoleSummary()
        {
            var res = _productionservice.RoleSummary();
            return Ok(new{
                Status = true,
                Message = "Production summary according to role",
                Data = res
            });
        }

        [HttpGet("ShiftSummary")]
        public IActionResult ShiftSummary()
        {
            var res = _productionservice.ShiftSummary();
            return Ok(new
            {
                Status = true,
                Message = "Shift summary according to role",
                Data = res
            });
        }
    }
}
