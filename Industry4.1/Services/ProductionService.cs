using Industry4._1.Data;
using Industry4._1.DTOs;
using Industry4._1.Interfaces;
using Industry4._1.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
//using System.Reflection.PortableExecutable;

namespace Industry4._1.Services
{
    public class ProductionService : IProductionService
    {
        private readonly AppDBContext _context;

        public ProductionService(AppDBContext context)
        {
            _context = context;
        }


        public ProductionEntry ProductinAlreadypresent(string JobId)
        {
            var ProdEntryAlredy = _context.ProductionEntries.Where(i => i.JobId == JobId).FirstOrDefault();

            return ProdEntryAlredy;
        }
        public Machine checkMachine(string MachineCode)
        {
            var machine = _context.Machines.FirstOrDefault(m => m.MachineCode == MachineCode);
            return machine;
        }

        public Shift checkShift(string ShiftName)
        {
            var machine = _context.Shifts.FirstOrDefault(m => m.ShiftName == ShiftName);
            return (machine );
        }

        public AppUser checkUser(string EmployeeId)
        {
            var machine = _context.AppUsers.FirstOrDefault(m => m.EmployeeId == EmployeeId);
            return (machine );
        }


        public ProductionEntry AddProduction(ProductionCreateDto dto)
        {
            var production = new ProductionEntry
            {
                MachineCode = dto.MachineCode,
                JobId = dto.JobId,
                ShiftName = dto.ShiftName,
                UserEmployeeId = dto.UserEmployeeId,
                OkParts = dto.OkParts,
                NcParts = dto.NcParts,
                EntryTime = DateTime.Now
            };

            _context.ProductionEntries.Add(production);
            _context.SaveChanges();

            return production;
        }



        public List<ProductionResponseDto> Get()
        {
            var result = (
                from p in _context.ProductionEntries
                join m in _context.Machines on p.MachineCode equals m.MachineCode
                join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
                join s in _context.Shifts on p.ShiftName equals s.ShiftName
                select new ProductionResponseDto
                {
                    Id = p.Id,
                    MachineName = m.MachineName,
                    ShiftName = s.ShiftName,
                    EmployeeId = u.EmployeeId,
                    OkParts = p.OkParts,
                    NcParts = p.NcParts,
                    EntryTime = p.EntryTime,
                    JobId = p.JobId
                }
                ).ToList();
            return result;
        }



        public List<ProductionResponseDto> GetByShift(string shiftName)
        {

            var result = (
                from p in _context.ProductionEntries
                join m in _context.Machines on p.MachineCode equals m.MachineCode
                join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
                join s in _context.Shifts on p.ShiftName equals s.ShiftName
                where p.ShiftName == shiftName
                select new ProductionResponseDto
                {
                    Id = p.Id,
                    MachineName = m.MachineName,
                    ShiftName = s.ShiftName,
                    EmployeeId = u.EmployeeId,
                    OkParts = p.OkParts,
                    NcParts = p.NcParts,
                    EntryTime = p.EntryTime,
                    JobId = p.JobId
                }
                ).ToList();

            if (result.Count == 0)
            {

                return null;
            }

            return result;
        }


        public ProductionEntry GetByProductId(int PrudID)
        {
            var result = _context.ProductionEntries.Where(i => i.Id == PrudID).FirstOrDefault();

            if (result == null)
            {
                return null;
            }

            return result;
        }


        public ProductionEntry DeleteProduction(string jobId)
        {
            var res = _context.ProductionEntries.Where(i => i.JobId == jobId).FirstOrDefault();
            if (res == null)
            {
                return null;
            }
            _context.ProductionEntries.Remove(res);
            _context.SaveChanges();
            return res;
        }

        public ProductionEntry UpdateProduction(UpdateProductionDto dto)
        {
            var res = _context.ProductionEntries.Where(i => i.JobId == dto.JobId).FirstOrDefault();
            if (res == null)
            {
                return null;
            }
            res.ShiftName = dto.ShiftName;
            res.MachineCode = dto.MachineCode;
            res.UserEmployeeId = dto.UserEmployeeId;
            res.OkParts = dto.OkParts;
            res.NcParts = dto.NcParts;
            res.EntryTime = dto.EntryTime;
            _context.SaveChanges();
            return res;
        }


        public int TotalOKCount()
        {
            var totalOk = _context.ProductionEntries.Sum(p => p.OkParts);
            return totalOk;
        }

        public int TotalNCCount()
        {
            var totalNc = _context.ProductionEntries.Sum(p => p.NcParts);
            return totalNc;
        }


        public TotalOKCountFromMachineResponse TotalOKCountFromMachine(string machineCode)
        {
            var totalOk = _context.ProductionEntries.Where(p => p.MachineCode == machineCode).ToList();
            if (totalOk.Count == 0) return null; 
            var totalokM = totalOk.Sum(p => p.OkParts);
            var totalncM = totalOk.Sum(p => p.NcParts);
            return (new TotalOKCountFromMachineResponse
            {
                MachineCode = machineCode,
                TotalOkParts = totalokM,
                TotalNcParts = totalncM,
                TotalProduction = totalokM + totalncM
            });
        }


        public TotalOKCountFromMachinedateResponse TotalOKCountFromMachinedate(string machineCode, DateTime from, DateTime to)
        {
            var production = _context.ProductionEntries
        .Where(p => p.MachineCode == machineCode
        && p.EntryTime >= from
        && p.EntryTime <= to)
        .ToList();
            if (production.Count == 0) return null;

            var totalokM = production.Sum(p => p.OkParts);
            var totalncM = production.Sum(p => p.NcParts);
            return (new TotalOKCountFromMachinedateResponse
            {
                MachineCode = machineCode,
                fromDate = from,
                toDate = to,
                TotalOkParts = totalokM,
                TotalNcParts = totalncM,
                TotalProduction = totalokM + totalncM
            });
        }


        public TotalOKCountFromMachineAndEmployeedateResponse TotalOKCountFromMachineAndEmployeedate(TotalOKCountFromMachineAndEmployeedateDto dto)
        {
            var production = _context.ProductionEntries
        .Where(p => p.MachineCode == dto.MachineCode
        && p.UserEmployeeId == dto.EmployeeId
        && p.EntryTime >= dto.fromDate
        && p.EntryTime <= dto.toDate)
        .ToList();
            if (production.Count == 0) return null;

            var totalokM = production.Sum(p => p.OkParts);
            var totalncM = production.Sum(p => p.NcParts);
            return (new TotalOKCountFromMachineAndEmployeedateResponse
            {
                EmployeeId = dto.EmployeeId,
                MachineCode = dto.MachineCode,
                fromDate = dto.fromDate,
                toDate = dto.toDate,
                TotalOkParts = totalokM,
                TotalNcParts = totalncM,
                TotalProduction = totalokM + totalncM
            });
        }

        public List<machinesummaryResponse> machinesummary()
        {
            var result = (
        from p in _context.ProductionEntries
        join m in _context.Machines on p.MachineCode equals m.MachineCode
        group p by new
        {
            m.MachineCode
        }
        into g
        select new machinesummaryResponse
        {
            Machine = g.Key.MachineCode,
            
            TotalOkParts = g.Sum(x => x.OkParts),
            TotalNcParts = g.Sum(x => x.NcParts),
            TotalProduction = g.Sum(x => x.OkParts + x.NcParts)
        }).ToList();

            if (result.Count == 0)
            {
                return null;
            }

            return result;
        }

        public List<MachineSummaryDto> machinesummary1()
        {
            var result = _context.ProductionEntries
                .GroupBy(p => p.MachineCode)
                .Select(g => new MachineSummaryDto
                {
                    Machine = g.Key,
                    TotalOkParts = g.Sum(x => x.OkParts),
                    TotalNcParts = g.Sum(x => x.NcParts),
                    TotalProduction = g.Sum(x => x.OkParts + x.NcParts)
                })
                .ToList();

            return result;
        }


        public List<operatorperformanceDto> operatorperformance()
        {
            var result = (
        from p in _context.ProductionEntries
        join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
        group p by new
        {
            u.EmployeeId

        }
        into g
        select new operatorperformanceDto
        {
            EmployeeId = g.Key.EmployeeId,
            TotalOKParts = g.Sum(x => x.OkParts),
            TotalNCParts = g.Sum(x => x.NcParts),
            TotalParts = g.Sum(x => x.OkParts + x.NcParts),
            Performance = (g.Sum(x => x.OkParts) / (double)g.Sum(x => x.OkParts + x.NcParts)) * 100
        }).ToList();


            if (result.Count == 0)
            {
                return null;
            }

            return result;
        }

        public operatorperformanceDto1 operatorperformance1()
        {
            var result = (
        from p in _context.ProductionEntries
        join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
        group p by new
        {
            u.EmployeeId

        }
        into g
        select new operatorperformanceDto1
        {
            user = g.Key.EmployeeId,
            totalOkParts = g.Sum(x => x.OkParts),
            
        }).OrderByDescending(x => x.totalOkParts)
.FirstOrDefault(); ;



            return result;
        }




        public List<resultResponseDto> ShiftReport()
        {
            var result = _context.ProductionEntries
                .GroupBy(p => p.ShiftName)
                .Select(g => new resultResponseDto
                {
                    
                    shift = g.Key,
                    
                    totalOk = g.Sum(x => x.OkParts),
                    totalNc = g.Sum(x => x.NcParts),
                    //TotalParts = g.Sum(x => x.OkParts + x.NcParts),
                    //Performance = (g.Sum(x => x.OkParts) /
                    //              (double)g.Sum(x => x.OkParts + x.NcParts)) * 100
                }).ToList();

            if (result.Count == 0)
                return null;

            return result;
        }


        public dailyResponseDto daily(DateOnly date)
        {
            var start = date.ToDateTime(TimeOnly.MinValue); // 00:00:00
            var end = start.AddDays(1);                     // next day

            var production = _context.ProductionEntries
                .Where(p => p.EntryTime >= start && p.EntryTime < end)
                .ToList();

            if (!production.Any())
            {
                return null;
            }

            return new dailyResponseDto
            {
                Date = date,
                TotalOkParts = production.Sum(p => p.OkParts),
                TotalNcParts = production.Sum(p => p.NcParts),
                TotalProduction = production.Sum(p => p.OkParts + p.NcParts)
            };
        }


        public TopMachineResponseDto TopMachine()
        {
            var result = _context.ProductionEntries
                .GroupBy(p => p.MachineCode)
                .Select(g => new TopMachineResponseDto
                {
                    MachineCode = g.Key,
                   
                    TotalProduction = g.Sum(x => x.OkParts + x.NcParts)
                })
            .OrderByDescending(x => x.TotalProduction).First();



            if (result == null)
            {
                return null;
            }

            return result;
        }


        
        public ProductionbyMachineUserPerCycleResponseDto ProductionbyMachineUserPerCycle(GetMachineandUserProduction dto)
        {


            var production = _context.ProductionEntries
            .Where(p => p.MachineCode == dto.MachineCode && p.UserEmployeeId == dto.EmployeeId
            && p.EntryTime >= dto.from
            && p.EntryTime <= dto.to)
            .ToList();

            if (production.Count == 0)
            {
                return null;
            }

            return (new ProductionbyMachineUserPerCycleResponseDto
            {
                MachineCode = dto.MachineCode,
                EmployeeId = dto.EmployeeId,
                fromDate = dto.from,
                toDate = dto.to,
                TotalOkParts = production.Sum(p => p.OkParts),
                TotalNcParts = production.Sum(p => p.NcParts),
                TotalProduction = production.Sum(p => p.OkParts) + production.Sum(p => p.NcParts)
            });
        }

        public List<MachineUser1ResponseDto> MachineUser1(MachineUser dto)
        {
            var result = (
            from p in _context.ProductionEntries
            join m in _context.Machines on p.MachineCode equals m.MachineCode
            join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
            where m.MachineCode == dto.MachineCode
            group p by new
            {
                u.EmployeeId
            }
            into g
            select new MachineUser1ResponseDto
            {

                OperatorID = g.Key.EmployeeId

            }
            ).ToList();

            return result;
        }



        public MachineUser2ResponseDto MachineUser2(MachineUser dto)
        {
            


            var result1 = (
                from p in _context.ProductionEntries
                join m in _context.Machines on p.MachineCode equals m.MachineCode
                join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
                where m.MachineCode == dto.MachineCode && u.EmployeeId == dto.EmployeeId


                select new MachineUser2ResponseDto
                {

                    OperatorID = u.Id,
                    OperatorEID = u.EmployeeId,
                    OperatorRole = u.Role,
                    OperatorStatus = u.IsActive
                }
                ).FirstOrDefault();

            return result1;



        }

        public List<RoleSummaryResponseDto> RoleSummary()
        {
            var summary = (
                from p in _context.ProductionEntries
                join m in _context.Machines on p.MachineCode equals m.MachineCode
                join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
                join s in _context.Shifts on p.ShiftName equals s.ShiftName
                group p by new
                {
                    u.Role
                }
                into g 
                select new RoleSummaryResponseDto
                {
                    Role = g.Key.Role,
                    TotalOkParts = g.Sum(p => p.OkParts),
                    TotalNcParts = g.Sum(p => p.NcParts),
                    TotalProduction = g.Sum(p => p.OkParts) + g.Sum(p => p.NcParts)
                }
                ).ToList();

            return summary;
        }

        public List<ShiftSummaryResponseDto> ShiftSummary()
        {
            var summary = (
                from p in _context.ProductionEntries
                join m in _context.Machines on p.MachineCode equals m.MachineCode
                join u in _context.AppUsers on p.UserEmployeeId equals u.EmployeeId
                join s in _context.Shifts on p.ShiftName equals s.ShiftName
                group p by new
                {
                    s.ShiftName
                }
                into g
                select new ShiftSummaryResponseDto
                {
                    Shift = g.Key.ShiftName,
                    TotalOkParts = g.Sum(p => p.OkParts),
                    TotalNcParts = g.Sum(p => p.NcParts),
                    TotalProduction = g.Sum(p => p.OkParts) + g.Sum(p => p.NcParts)
                }
                ).ToList();

            return summary;

        }

    }
}
