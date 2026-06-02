using Industry4._1.Data;
using Industry4._1.DTOs.LogicHandeling;
using Industry4._1.DTOs.MachineDto;
using Industry4._1.Interfaces;
using Industry4._1.Model;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.PortableExecutable;
using Machine = Industry4._1.Model.Machine;

namespace Industry4._1.Services
{
    public class MachineService : IMachineService
    {

        private readonly AppDBContext _context;

        public MachineService(AppDBContext context)
        {
            _context = context;
        }

        public Machine CreateMachine(MachineDTO machinedto)
        {
            var machine = new Machine {
                MachineCode = machinedto.MachineCode,
                MachineName = machinedto.MachineName,
                IsActive = machinedto.IsActive,
                employeesWorking = machinedto.employeesWorking       
            };

            _context.Machines.Add(machine);
            _context.SaveChanges();
            return machine;
        }

        public List<Machine> GetAllMachines()
        {
            var machines = _context.Machines.ToList();

            return machines;

        }
        public List<GetAllMachinesStatusResponseDto> GetAllMachinesStatus()
        {
            var machines = _context.Machines
                .Select(m => new GetAllMachinesStatusResponseDto
                {
                    Id = m.Id,
                    MachineCode= m.MachineCode,
                    IsActive= m.IsActive
                }).ToList();
            return (machines);

        }

        public List<MachineCodeDto> GetAllMachinesCode()
        {
            var machines =  _context.Machines
        .Select(m => new MachineCodeDto
        {
            MachineCode = m.MachineCode
            

        })
        .ToList();
           

            return machines;

        }
        
        public List<MachineNameeDto> GetAllMachinesName()
        {
            var machines = _context.Machines
        .Select(m => new MachineNameeDto
        {
            MachineName = m.MachineName

        })
        .ToList();


            return machines;

        }

        public List<string> GetAllMachinesCodeonly()
        {
            var machines = _context.Machines
        .Select(m => m.MachineCode)
        .ToList();


            return machines;

        }



        public Machine GetMachineById(int id)
        {
            var machines = _context.Machines.FirstOrDefault(m => m.Id == id);
            if (machines == null) {
                return null;
            }

            return machines;

        }

        public Machine DeleteMachine(int id)
        {
            var machine = _context.Machines.FirstOrDefault(m => m.Id == id);
            if (machine == null)
            {
                return null;
            }

            _context.Machines.Remove(machine);
            _context.SaveChanges();
            return machine;

        }

        public Machine UpdateMachine(UpdateMachineDto dto)
        {
            var machine = _context.Machines.FirstOrDefault(m => m.Id == dto.Id);
            if (machine == null)
            {
                return null;
            }
            machine.MachineCode = dto.MachineCode;
            machine.MachineName = dto.MachineName;
            machine.IsActive = dto.IsActive;
            machine.employeesWorking = dto.employeesWorking;

            _context.SaveChanges();
            return machine;


        }

        public Usre AddUser(CreateUserDto dto)
        {
            var user = new Usre
            {
                userName = dto.userName,
                password = dto.password 
            };
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }


        public List<Login> Login(LoginAndMachine dto)
        {
            var result = _context.Users.FirstOrDefault(i => i.userName == dto.userName && i.password == dto.password);
           

            if (dto.mId == 0 && result != null)

            {
                var machines = _context.Machines
       .Select(m => new Login
       {
           machineId = m.Id
       })
       .ToList();


                return machines;
            }
            return null;

        }

        public Machine LoginMachine(LoginAndMachine dto)
        {
            var machines = _context.Machines.FirstOrDefault(m => m.Id == dto.mId);
            if (machines != null && dto.userName == "" && dto.password == "")
            {
                return machines;
            }
            return null;

           

        }
    } 
}
